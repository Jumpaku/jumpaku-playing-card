#!/usr/bin/env node

let res = await fetch(`http://localhost:3000/api/v1/app/authentication/temporary/register-login`, {
    method: 'POST',
});
let body = await res.json();
console.log(JSON.stringify(body));


res = await fetch(`http://localhost:3000/api/v1/app/authentication/refresh`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.refreshToken}`
    },
});
body = await res.json();
console.log(JSON.stringify(body));
