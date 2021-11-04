/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
require('dotenv').config()
import { LogLevel } from '../interfaces/logger.interface'
import * as chalk from 'chalk'

const CONTEXT_INDEX_IN_STACK = 5
const isProduction = process.env.NODE_ENV === 'production'
const isTraceOff = process.env.LOGARDIAN_TRACE === 'false'

interface FunctionTraceInfo {
    caller?: string
    path?: string
}

export const getFunctionTrace = (
    level: LogLevel,
    forceEnable?: boolean,
): string => {
    let isTraceEnabled = isTraceEnabledByDefault(level)

    const result: FunctionTraceInfo = {}

    if (forceEnable) {
        isTraceEnabled = forceEnable
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

    const { caller, path } = result

    return `${caller ? `\ncaller ${chalk.gray(`->`)} ${caller}` : ''}${
        path ? `\npath ${chalk.gray(`->`)} ${path}` : ``
    }`
}

export function isTraceEnabledByDefault(level: LogLevel): boolean {
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
