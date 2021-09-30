/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
require('dotenv').config()

const CONTEXT_INDEX_IN_STACK = 4
const isProduction = process.env.NODE_ENV === 'production'
const isTraceOff = process.env.LOGARDIAN_TRACE === 'false'

interface FunctionTraceInfo {
    caller?: string
    path?: string
}

export const getFunctionTrace = (
    level: string,
    meta: any[],
): FunctionTraceInfo => {
    let isTraceEnabled = isTraceEnabledByDefault(level)

    const result: FunctionTraceInfo = {}

    const executorFromConfig = meta.find(
        (value: any) => typeof value === 'object' && 'trace' in value,
    )

    if (executorFromConfig) {
        isTraceEnabled = executorFromConfig.trace
    }

    if (isTraceEnabled) {
        try {
            throw new Error()
        } catch (error) {
            const stacktrace = error.stack.split(' at ') as string[]

            const context = stacktrace[CONTEXT_INDEX_IN_STACK]

            const [caller, functionTrace] = context.split('(')

            if (!functionTrace) {
                result.path = caller
                result.caller = `anonymous function`
            } else {
                const [path] = functionTrace.split(')')

                result.path = path
                result.caller = caller
            }
        }
    }

    return result
}

export function isTraceEnabledByDefault(level: string): boolean {
    if (isTraceOff) {
        return false
    }

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
