import {Injectable} from "@nestjs/common";
import {ConfigProvider} from "./config.provider";
import {Pool, PoolClient} from "pg";
import {LoggerProvider} from "./logger.provider";

@Injectable()
export class PostgresProvider {
    constructor(private readonly config: ConfigProvider, private readonly logger: LoggerProvider) {
        // open connection
        this.pool = new Pool({connectionString: ""})
    }

    pool: Pool

    async transaction(fn: (c: any) => Promise<void>) {
        // https://node-postgres.com/features/transactions#examples
        const client = await this.newClient();
        try {
            await client.query('BEGIN')
            await fn(client);
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    async close() {
        await this.pool.end()
    }

    private async newClient(): Promise<PoolClient> {
        // https://node-postgres.com/guides/project-structure
        const client = await this.pool.connect()
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!')
            console.error(`The last executed query on this client was: ${
                // @ts-ignore
                client.lastQuery}`)
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        // @ts-ignore
        client.query = ((...args: any[]) => {
            // @ts-ignore
            client.lastQuery = args
            // @ts-ignore
            return query.apply(client, args)
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
