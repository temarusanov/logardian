/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
require('dotenv').config()

const CONTEXT_INDEX_IN_STACK = 4
const isProduction = process.env.NODE_ENV === 'production'

interface FunctionTraceInfo {
    caller?: string
    path?: string
    trace: boolean
}

export const getFunctionTrace = (
    level: string,
    meta: any[],
): FunctionTraceInfo => {
    const isTraceEnabled = isTraceEnabledByDefault(level)
    const result: FunctionTraceInfo = {
        trace: isTraceEnabled,
    }

    const executorFromConfig = meta.find(
        (value: any) => typeof value === 'object' && 'trace' in value,
    )

    if (executorFromConfig) {
        result.trace = executorFromConfig.executor
    }

    try {
        throw new Error()
    } catch (error) {
        const stacktrace = error.stack.split(' at ') as string[]

        const context = stacktrace[CONTEXT_INDEX_IN_STACK]

        const [caller, functionPath] = context.split(' (')

        const [path] = functionPath.split(')')

        result.path = path
        result.caller = caller
    }

    return result
}

export function isTraceEnabledByDefault(level: string): boolean {
    switch (level) {
        case 'warn':
        case 'error':
            return !isProduction

        case 'debug':
            return true

        default:
            return false
    }
}
