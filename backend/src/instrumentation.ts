import {open} from "@/postgres/postgres";
import {getConfig, loadConfig} from "@/config/config";

export function register() {
    console.log('instrumentation.register')
    loadConfig()
    const config = getConfig();
    open(config.postgres_connection_string)
}

export function onRequestError(
    error: { digest: string } & Error,
    request: {
        path: string // resource path, e.g. /blog?name=foo
        method: string // request method. e.g. GET, POST, etc
        headers: { [key: string]: string }
    },
    context: {
        routerKind: 'Pages Router' | 'App Router' // the router type
        routePath: string // the route file path, e.g. /app/blog/[dynamic]
        routeType: 'render' | 'route' | 'action' | 'middleware' // the context in which the error occurred
        renderSource:
            | 'react-server-components'
            | 'react-server-components-payload'
            | 'server-rendering'
        revalidateReason: 'on-demand' | 'stale' | undefined // undefined is a normal request without revalidation
        renderType: 'dynamic' | 'dynamic-resume' // 'dynamic-resume' for PPR
    }) {
    console.log('instrumentation.onRequestError');
    console.log(error);
    console.log(request);
    console.log(context);
}