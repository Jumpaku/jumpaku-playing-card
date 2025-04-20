export class Session {
    accessToken;

    async newUser() {
        const loginId = `${Date.now()}`;
        await this.post({
            path: `/api/v1/app/authentication/password/register`,
            body: {loginId: loginId, password: 'password'},
        });

        const body = await this.post({
            path: `/api/v1/app/authentication/password/login`,
            body: {loginId: loginId, password: 'password'},
        });
        this.accessToken = body.accessToken;

        await this.post({
            path: `/api/v1/app/user`,
            body: {displayName: 'my name'},
            headers: {'Authorization': `Bearer ${this.accessToken}`},
        });
    }

    /**
     * @param args {{
     *     path: string,
     *     headers: Object,
     * }}
     * @return {Promise<{}>}
     */
    async get({path, headers}) {
        console.log(JSON.stringify({GET: `http://localhost:3000${path}`}));
        const res = await fetch(`http://localhost:3000${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken ? {'Authorization': `Bearer ${this.accessToken}`} : {}),
                ...(headers ?? {}),
            },
        });
        if (res.statusCode >= 400) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        return resBody;
    }

    /**
     * @param args {{
     *     path: string,
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async post({path, headers, body}) {
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
        if (res.statusCode >= 400) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        return resBody;
    }

    /**
     * @param args {{
     *     path: string,
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async put({path, headers, body}) {
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
        if (res.statusCode >= 400) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        return resBody;
    }


    /**
     * @param args {{
     *     path: string,
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async patch({path, headers, body}) {
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
        if (res.statusCode >= 400) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        return resBody;
    }


    /**
     * @param args {{
     *     path: string,
     *     headers: Object,
     *     body: Object
     * }}
     * @return {Promise<{}>}
     */
    async delete({path, headers, body}) {
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
        if (res.statusCode >= 400) {
            throw new Error(JSON.stringify({"ERROR": {statusCode: res.statusCode, statusText: res.statusText}}));
        }

        const resBody = await res.json();
        console.log(JSON.stringify({response: resBody}));

        return resBody;
    }
}
