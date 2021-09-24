/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config()
import { Logger, format, transports, createLogger } from 'winston'
import * as chalk from 'chalk'
import { Format } from 'logform'
import { colorizeContext } from './colorize-context.helper'

const JSON_SPACE = 2
const isProduction = process.env.NODE_ENV === 'production'

const { combine, timestamp, printf, colorize } = format

const colorizer = colorize()

export const createWinstonLogger = (): Logger => {
    const level = isProduction ? 'info' : 'debug'

    const output = createLogger({ level })

    const consoleFormat = createWinstonFormat()

    output.add(new transports.Console({ format: consoleFormat }))

    return output
}

function createWinstonFormat(): Format {
    return combine(
        timestamp(),
        format.splat(),
        format.simple(),
        printf((info) =>
            isProduction
                ? createProductionLog(info)
                : createDevelopmentLog(info),
        ),
    )
}

function createProductionLog(info: any): string {
    const {
        timestamp,
        message,
        level,
        label,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        trace,
        ...meta
    } = info

    return JSON.stringify(
        {
            timestamp,
            message: getMessage(message),
            level,
            label,
            metadata: getMetaForProduction(meta),
        },
        null,
        JSON_SPACE,
    )
}

function createDevelopmentLog(info: any): string {
    const {
        timestamp,
        message,
        level,
        label,
        caller,
        path,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        trace,
        ...meta
    } = info

    return `${getTime(timestamp)} ${getLevel(level)}: ${getLabel(
        label,
    )}${getMessage(message)}${getMeta(meta)}${getExecutorValues(caller, path)}`
}

function getTime(timestamp: string): string {
    const time = new Date(timestamp).toISOString()

    // 2021-09-24T05:10:47.306Z => 2021-09-24 05:10:47
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return `${chalk.cyan(`[${`${time.substr(0, 10)} ${time.substr(11, 8)}`}]`)}`
}

function getLevel(level: string): string {
    return colorizer.colorize(level, level)
}

function getMessage(message: string): string {
    return typeof message === 'string'
        ? message
        : `\n${JSON.stringify(message, null, JSON_SPACE)}`
}

function getLabel(label: string): string {
    return `${label ? colorizeContext(label, '[' + label + '] ') : ''}`
}

function getExecutorValues(caller: string, path: string): string {
    return `${caller ? `\ncaller ${chalk.gray(`->`)} ${caller}` : ''}${
        path ? `\npath ${chalk.gray(`->`)} ${path}` : ``
    }`
}

function getMeta(meta: any): string {
    if (Object.keys(meta).length) {
        let resultLine = `\n`

        if (typeof meta[0] === 'string' && meta[0].length === 1) {
            return ``
        }

        if (meta[0]) {
            resultLine += JSON.stringify(Object.values(meta), null, JSON_SPACE)
        } else {
            resultLine += JSON.stringify(meta, null, JSON_SPACE)
        }

        return resultLine
    }

    return ``
}

function getMetaForProduction(meta: any): any {
    if (typeof meta[0] === 'string' && meta[0].length === 1) {
        return {}
    }

    return meta
}
