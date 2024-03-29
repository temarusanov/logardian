require('dotenv').config()
import { performance } from 'perf_hooks'
import { LoggerInterface, LogLevel } from './interfaces/logger.interface'
import { clc } from './utils/cli-colors.util'
import { isPlainObject } from './utils/utils'
import { isMatch } from 'micromatch'
import * as chalk from 'chalk'
import { LogMethodOptions } from './interfaces/log-method-options.interface'
import { LoggerConfig } from './interfaces/logger-options.interface'
import { JsonLog } from './interfaces/json-log.interface'
import { DefaultLog } from './interfaces/default-log.interface'
import { context, trace } from '@opentelemetry/api'

const isProduction = process.env.NODE_ENV === 'production'

const JSON_SPACE = 2
const CONTEXT_INDEX_IN_STACK = 6

export class Logger implements LoggerInterface {
    private _timers: Map<string, number> = new Map()

    _config: LoggerConfig = {
        labels: ['*'],
        traceId: true,
        trace: false,
        colors: {
            timestamp: '#E5E5E5',
            traceId: '#E5E5E5',
            label: '#E5E5E5',
        },
    }

    log(message: any, options?: LogMethodOptions): void
    log(message: any, ...optionalParams: [...any, string?]): void
    log(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'log')
    }

    error(message: any, options?: LogMethodOptions, stack?: string): void
    error(message: any, ...optionalParams: [...any, string?, string?]): void
    error(message: any, ...optionalParams: any[]): void {
        const { options, stack } = this._findOptionsAndStack(optionalParams)
        this._printMessage(message, options, 'error', 'stderr', stack)
    }

    warn(message: any, options?: LogMethodOptions): void
    warn(message: any, ...optionalParams: [...any, string?]): void
    warn(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'warn')
    }

    debug(message: any, options?: LogMethodOptions): void
    debug(message: any, ...optionalParams: [...any, string?]): void
    debug(message: any, ...optionalParams: any[]): void {
        if (isProduction) {
            return
        }

        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'debug')
    }

    verbose(message: any, options?: LogMethodOptions): void
    verbose(message: any, ...optionalParams: [...any, string?]): void
    verbose(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'verbose')
    }

    markTime(marker: string): void {
        this._timers.set(marker, performance.now())
    }

    measureTime(
        marker: string,
        message?: string,
        options?: LogMethodOptions,
    ): number {
        const timeStart = this._timers.get(marker)

        const time = performance.now() - timeStart

        if (message) {
            const formattedMessage = message.replace(
                RegExp('{n}'),
                `${time.toFixed(3)}`,
            )

            const foundOptions = this._findOptions([options])
            this._printMessage(formattedMessage, foundOptions, 'timer')
        }

        return time
    }

    getTraceId(): string | undefined {
        try {
            const currentSpan = trace.getSpan(context.active())

            if (!currentSpan) return

            const spanContext = trace.getSpan(context.active()).spanContext()

            return spanContext.traceId
        } catch (error) {
            return
        }
    }

    private _getTimestamp(): string {
        const time = new Date().toISOString()

        // 2021-09-24T05:10:47.306Z => 2021-09-24 05:10:47
        return `[${`${time.substr(0, 10)} ${time.substr(11, 12)}`}]`
    }

    private _printMessage(
        message: any,
        options: LogMethodOptions,
        logLevel: LogLevel,
        writeStreamType?: 'stdout' | 'stderr',
        stack?: string,
    ): void {
        const { label } = options

        if (label && !this._isLabelAllowed(label)) {
            return
        }

        let computedMessage = ''
        let traceId: string | undefined

        const { json } = this._config

        if (this._config.traceId) {
            traceId = this._getTraceId(message)
        }

        if (json) {
            computedMessage = this._createJsonLog({
                message,
                label,
                level: logLevel,
                stack,
                traceId,
            })
        } else {
            const { trace } = options

            computedMessage = this._createDefaultLog({
                message,
                label,
                level: logLevel,
                stack,
                trace,
                traceId,
            })
        }

        process[writeStreamType ?? 'stdout'].write(computedMessage)
    }

    private _createJsonLog(data: JsonLog): string {
        const { message, level, label, stack, traceId } = data

        return `\n${JSON.stringify({
            timestamp: new Date().toISOString(),
            message: isPlainObject(message)
                ? JSON.stringify(message, (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  )
                : (message as string),
            level,
            label,
            stack,
            traceId,
        })}`
    }

    private _createDefaultLog(data: DefaultLog): string {
        const { message, level, label, stack, trace, traceId } = data
        const { colors } = this._config

        const color = this._getColorByLogLevel(level)

        const output = isPlainObject(message)
            ? ` Object:\n${JSON.stringify(
                  message,
                  (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  JSON_SPACE,
              )}`
            : ` ${message as string}`

        const timestamp = this._getTimestamp()
        const formattedTraceId = traceId !== undefined ? ` [${traceId}]` : ''

        const labelMessage = label ? ' [' + label + ']' : ''

        const formattedLogLevel = color(level.toUpperCase().padStart(8))
        const traceMessage = this._getFunctionTrace(level, trace)
        const stackMessage = stack ? `\n${stack}` : ''

        const coloredOutput = colors.message
            ? chalk.hex(colors.message)(output)
            : output
        const coloredTrace = colors.trace
            ? chalk.hex(colors.trace)(traceMessage)
            : traceMessage
        const coloredStack = colors.stack
            ? chalk.hex(colors.stack)(stackMessage)
            : stackMessage

        const finalMessage =
            chalk.hex(colors.timestamp)(timestamp) +
            chalk.hex(colors.traceId)(formattedTraceId) +
            formattedLogLevel +
            chalk.hex(colors.label)(labelMessage) +
            coloredOutput +
            coloredTrace +
            coloredStack +
            '\n'

        return finalMessage
    }

    private _getTraceId(message: any): string | undefined {
        try {
            const currentSpan = trace.getSpan(context.active())

            if (!currentSpan) return

            const spanContext = trace.getSpan(context.active()).spanContext()

            const parsedMessage = isPlainObject(message)
                ? JSON.stringify(message, (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  )
                : (message as string)

            currentSpan.addEvent(parsedMessage)

            return spanContext.traceId
        } catch (error) {
            return
        }
    }

    private _findOptions(args: unknown[]): LogMethodOptions {
        const options = args.find(
            (arg) =>
                typeof arg === 'object' && ('trace' in arg || 'label' in arg),
        )

        if (!options) {
            return {}
        }

        return options
    }

    private _findOptionsAndStack(args: unknown[]): {
        options: LogMethodOptions
        stack?: string
    } {
        const options = args.find(
            (arg) =>
                typeof arg === 'object' && ('trace' in arg || 'label' in arg),
        ) as LogMethodOptions

        const stacktraceRegex = new RegExp(/at /g)

        const stack = args.find(
            (arg) => typeof arg === 'string' && stacktraceRegex.test(arg),
        ) as string

        if (!options) {
            return {
                stack,
                options: {},
            }
        }

        return {
            options,
            stack,
        }
    }

    private _isLabelAllowed(label: string): boolean {
        const { labels } = this._config

        if (labels === undefined) {
            return true
        }

        if (labels === false) {
            return false
        }

        return isMatch(label, labels)
    }

    private _getFunctionTrace(level: LogLevel, forceEnable?: boolean): string {
        let isTraceEnabled = this._isTraceEnabledByDefault(level)

        if (this._config.trace === false) {
            isTraceEnabled = false
        }

        if (forceEnable !== undefined) {
            isTraceEnabled = forceEnable
        }

        if (isProduction) {
            isTraceEnabled = false
        }

        if (isTraceEnabled) {
            try {
                throw new Error()
            } catch (error) {
                const stacktrace = error.stack.split(' at ') as string[]
                const context = stacktrace[CONTEXT_INDEX_IN_STACK]
                const [callerFunction, functionTrace] = context.split('(')

                const result: FunctionTrace = {}

                if (!functionTrace) {
                    result.path = callerFunction
                    result.caller = `anonymous function`
                } else {
                    const [path] = functionTrace.split(')')

                    result.path = path
                    result.caller = callerFunction
                }

                const { caller, path } = result

                return `${`\ncaller ${chalk.gray(
                    `->`,
                )} ${caller}`}${`\npath ${chalk.gray(`->`)} ${path}`}`
            }
        }

        return ''
    }

    private _isTraceEnabledByDefault(level: LogLevel): boolean {
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

    private _getColorByLogLevel(level: LogLevel): (text: string) => string {
        switch (level) {
            case 'debug':
                return clc.magentaBright
            case 'warn':
                return clc.yellow
            case 'error':
                return clc.red
            case 'verbose':
                return clc.cyanBright
            case 'timer':
                return clc.lightGreen
            default:
                return clc.green
        }
    }
}
