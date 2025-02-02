import {Injectable} from "@nestjs/common";
import {ConfigProvider} from "./config.provider";
import {Pool, PoolClient} from "pg";
import {LoggerProvider} from "./logger.provider";
import {setTypeParsers} from "../../gen/pg/dao/pg_type_parsers";

export interface PgClient {
    query(query: string, values: unknown[]): Promise<{ rows: unknown[] }>;
}

@Injectable()
export class PostgresProvider {
    constructor(config: ConfigProvider, private readonly logger: LoggerProvider) {
        logger.log(JSON.stringify({
            log: 'postgres',
            time: new Date(),
            message: 'open postgres pool connection',
        }));
        this.pool = new Pool({connectionString: config.get().postgresConnection});
        setTypeParsers();
    }

    private pool: Pool

    async transaction<R>(fn: (client: PgClient) => Promise<R>): Promise<R> {
        // https://node-postgres.com/features/transactions#examples
        const client = await this.newClient();
        let result: R;
        try {
            await client.query('BEGIN')
            result = await fn(client);
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
        return result;
    }

    async close() {
        this.logger.log(JSON.stringify({
            log: 'postgres',
            time: new Date(),
            message: 'close postgres pool connection',
        }));
        await this.pool.end()
    }

    private async newClient(): Promise<PoolClient> {
        const logger = this.logger;
        // https://node-postgres.com/guides/project-structure
        const client = await this.pool.connect()
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            // @ts-ignore
            const [stmt, params] = client.lastQuery
            logger.warn(JSON.stringify({
                log: 'postgres',
                time: new Date(),
                message: 'postgres client timeout',
                postgres: {
                    stmt, params
                },
            }));
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        // @ts-ignore
        client.query = ((...args: any[]) => {
            const [stmt, params] = args;
            logger.debug(JSON.stringify({
                log: 'postgres',
                time: new Date(),
                message: 'execute postgres query',
                postgres: {
                    stmt: stmt,
                    params: params,
                }
            }));
            // @ts-ignore
            client.lastQuery = args;

            return query.apply(client, args);
        });
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout)
            // set the methods back to their old un-monkey-patched version
            client.query = query
            client.release = release
            return release.apply(client)
        }
        return client
    }
}

export async function selectAll<T>(client: PgClient, stmt: string, params: unknown[]): Promise<T[]> {
    const {rows} = await client.query(stmt, params)
    return (rows ?? []) as T[];
}

export async function selectOne<T>(client: PgClient, stmt: string, params: unknown[]): Promise<T | null> {
    const {rows} = await client.query(stmt, params)
    const rs = (rows ?? []) as T[];
    if (rs.length === 0) {
        return null;
    }
    return rs[0];
}
