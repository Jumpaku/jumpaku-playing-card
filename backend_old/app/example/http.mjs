export class Session {
    /**
     * @constructor
     * @param ignoreError {boolean}
     */
    constructor(ignoreError = false) {
        this.panicOnError = !ignoreError;
        this.accessToken = null;
    }

    async newUser() {
        const loginId = `${Date.now()}`;
        await this.post(`/api/v1/app/authentication/password/register`, {
            body: {loginId: loginId, password: 'password'},
        });

        const body = await this.post(`/api/v1/app/authentication/password/login`, {
            body: {loginId: loginId, password: 'password'},
        });
        this.accessToken = body.accessToken;

        await this.post(`/api/v1/app/user`, {
            body: {displayName: 'my name'},
            headers: {'Authorization': `Bearer ${this.accessToken}`},
        });
    }

    /**
     * @param path {string}
     * @param args {{
     *     headers: Object,
     * }}
     * @return {Promise<{}>}
     */
    async get(path, args = undefined) {
        const {headers} = args ?? {};
        console.log(JSON.stringify({GET: `http://localhost:3000${path}`}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
        });

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        if (!res.ok && this.panicOnError) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        return resBody;
    }

    /**
     * @param path {string}
     * @param args {{
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async post(path, args = undefined) {
        const {headers, body} = args ?? {};
        console.log(JSON.stringify({POST: `http://localhost:3000${path}`}));
        console.log(JSON.stringify({request: body}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
            body: JSON.stringify(body),
        });

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        if (!res.ok && this.panicOnError) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        return resBody;
    }

    /**
     * @param path {string}
     * @param args {{
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async put(path, args = undefined) {
        const {headers, body} = args ?? {};
        console.log(JSON.stringify({PUT: `http://localhost:3000${path}`}));
        console.log(JSON.stringify({request: body}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
            body: JSON.stringify(body),
        });

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        if (!res.ok && this.panicOnError) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        return resBody;
    }


    /**
     * @param path {string}
     * @param args {{
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async patch(path, args = undefined) {
        const {headers, body} = args ?? {};
        console.log(JSON.stringify({PATCH: `http://localhost:3000${path}`}));
        console.log(JSON.stringify({request: body}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
            body: JSON.stringify(body),
        });

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        if (!res.ok && this.panicOnError) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        return resBody;
    }


    /**
     * @param path {string}
     * @param args {{
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async delete(path, args = undefined) {
        const {headers, body} = args ?? {};
        console.log(JSON.stringify({DELETE: `http://localhost:3000${path}`}));
        console.log(JSON.stringify({request: body}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
            body: JSON.stringify(body),
        });

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        if (!res.ok && this.panicOnError) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        return resBody;
    }
}
