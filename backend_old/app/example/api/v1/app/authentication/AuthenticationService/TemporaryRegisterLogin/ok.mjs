#!/usr/bin/env node
let res = await fetch(`http://localhost:3000/api/v1/app/authentication/temporary/register-login`, {
    method: 'POST',
});
let body = await res.json();
console.log(JSON.stringify(body));



