import {ClientBase, Pool} from "pg";

let pool: Pool

export function open(connectionString: string) {
    pool = new Pool({connectionString})
}

export async function close() {
    await pool.end()
}

async function newClient() {
    // https://node-postgres.com/guides/project-structure
    const client = await pool.connect()
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

export async function transaction(callback: (c: ClientBase) => Promise<void>) {
    // https://node-postgres.com/features/transactions#examples
    const client = await newClient();
    try {
        await client.query('BEGIN')
        await callback(client);
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}
