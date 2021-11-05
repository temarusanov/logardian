/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
require('dotenv').config()
import { yellow } from 'chalk'
import { LoggerInterface, LogLevel } from './interfaces/logger.interface'
import { clc } from './utils/cli-colors.util'
import { isPlainObject } from './utils/utils'
import { colorizeContext } from './utils/colorize-context.util'
import * as chalk from 'chalk'
import { LoggerOptions } from './interfaces/logger-options.interface'
import { getFunctionTrace } from './utils/get-function-trace.util'
import { parseLabels } from './utils/parse-labels.util'

const isProduction = process.env.NODE_ENV === 'production'
const isJsonPrint = process.env.LOGARDIAN_JSON === 'true'
const labels = parseLabels()

const JSON_SPACE = 2

export class Logger implements LoggerInterface {
    private static _lastTimestampAt?: number

    log(message: any, options?: LoggerOptions): void
    log(message: any, ...optionalParams: [...any, string?]): void
    log(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'log')
    }

    error(message: any, options?: LoggerOptions, stack?: string): void
    error(message: any, ...optionalParams: [...any, string?, string?]): void
    error(message: any, ...optionalParams: any[]): void {
        const { options, stack } = this._findOptionsAndStack(optionalParams)
        this._printMessage(message, options, 'error', 'stderr', stack)
    }

    warn(message: any, options?: LoggerOptions): void
    warn(message: any, ...optionalParams: [...any, string?]): void
    warn(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'warn')
    }

    debug(message: any, options?: LoggerOptions): void
    debug(message: any, ...optionalParams: [...any, string?]): void
    debug(message: any, ...optionalParams: any[]): void {
        if (isProduction) {
            return
        }

        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'debug')
    }

    verbose(message: any, options?: LoggerOptions): void
    verbose(message: any, ...optionalParams: [...any, string?]): void
    verbose(message: any, ...optionalParams: any[]): void {
        const options = this._findOptions(optionalParams)
        this._printMessage(message, options, 'verbose')
    }

    private _getTimestamp(): string {
        const time = new Date().toISOString()

        // 2021-09-24T05:10:47.306Z => 2021-09-24 05:10:47
        return `${chalk.cyan(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            `[${`${time.substr(0, 10)} ${time.substr(11, 12)}`}]`,
        )}`
    }

    private _printMessage(
        message: any,
        options: LoggerOptions,
        logLevel: LogLevel,
        writeStreamType?: 'stdout' | 'stderr',
        stack?: string,
    ): void {
        const color = this._getColorByLogLevel(logLevel)

        const { label, trace } = options

        const output = isPlainObject(message)
            ? `Object:\n${JSON.stringify(
                  message,
                  (key, value) =>
                      typeof value === 'bigint' ? value.toString() : value,
                  JSON_SPACE,
              )}\n`
            : (message as string)

        if (label && !labels.includes('*') && !labels.includes(label)) {
            return
        }

        const timestamp = this._getTimestamp()

        const labelMessage = label
            ? colorizeContext(label, '[' + label + '] ')
            : ''

        const timestampDiff = this._updateAndGetTimestampDiff()

        const formattedLogLevel = color(logLevel)

        let computedMessage = ''

        if (isJsonPrint) {
            computedMessage = this._createProductionLog({
                message,
                label,
                level: logLevel,
                stack,
            })
        } else {
            const traceMessage = getFunctionTrace(logLevel, trace)
            const stackMessage = stack ? `${stack}\n` : ''

            computedMessage = `${timestamp} ${formattedLogLevel}: ${labelMessage}${output}${traceMessage} ${timestampDiff}\n${stackMessage}`
        }

        process[writeStreamType ?? 'stdout'].write(computedMessage)
    }

    private _createProductionLog(data: {
        message: string
        level: string
        label: string
        stack?: string
    }): string {
        const { message, level, label, stack } = data

        return `\n${JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                message: isPlainObject(message)
                    ? JSON.stringify(
                          message,
                          (key, value) =>
                              typeof value === 'bigint'
                                  ? value.toString()
                                  : value,
                          JSON_SPACE,
                      )
                    : (message as string),
                level,
                label,
                stack,
            },
            null,
            JSON_SPACE,
        )}`
    }

    private _updateAndGetTimestampDiff(): string {
        const currentDate = Date.now()

        Logger._lastTimestampAt = currentDate

        return yellow(`+${currentDate - Logger._lastTimestampAt}ms`)
    }

    private _findOptions(args: unknown[]): LoggerOptions {
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
        options: LoggerOptions
        stack?: string
    } {
        const options = args.find(
            (arg) =>
                typeof arg === 'object' && ('trace' in arg || 'label' in arg),
        ) as LoggerOptions

        const stack =
            typeof args[args.length - 1] === 'string'
                ? (args.pop() as string)
                : undefined

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
            default:
                return clc.green
        }
    }
}
