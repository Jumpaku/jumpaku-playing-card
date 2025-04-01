#!/usr/bin/env node

const loginId = `${Date.now()}`;
let res = await fetch(`http://localhost:3000/api/v1/app/authentication/password/register`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        loginId: loginId,
        password: 'password',
    }),
});
let body = await res.json();
console.log(JSON.stringify(body));


res = await fetch(`http://localhost:3000/api/v1/app/authentication/password/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        loginId: loginId,
        password: 'password',
    }),
});
body = await res.json();
console.log(JSON.stringify(body));


res = await fetch(`http://localhost:3000/api/v1/app/user`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.accessToken}`
    },
    body: JSON.stringify({
        displayName: 'my name',
    }),
});
body = await res.json();
console.log(JSON.stringify(body));
