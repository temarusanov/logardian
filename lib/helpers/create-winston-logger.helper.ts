/* eslint-disable */
require('dotenv').config()
import { Logger, format, transports, createLogger } from 'winston'
import * as chalk from 'chalk'
import { Format } from 'logform'
import { colorizeContext } from './colorize-context.helper'

const JSON_SPACE = 2
const isProduction = process.env.NODE_ENV === 'production'

const { json, combine, timestamp, printf, colorize, metadata } = format

const level = isProduction ? 'info' : 'debug'
const consoleFormat = isProduction
    ? createWinstonFormatForProduction()
    : createWinstonFormatForDevelopment()

export const createWinstonLogger = (): Logger => {
    const output = createLogger({ level })

    output.add(new transports.Console({ format: consoleFormat }))

    return output
}

function createWinstonFormatForProduction(): Format {
    return combine(
        timestamp(),
        metadata({
            fillExcept: ['message', 'level', 'timestamp', 'label'],
        }),
        json({ space: JSON_SPACE }),
    )
}

function createWinstonFormatForDevelopment(): Format {
    return combine(
        colorize(),
        timestamp(),
        format.splat(),
        format.simple(),
        printf((data) => createLine(data)),
    )
}

function createLine(info: any): string {
    const {
        timestamp,
        message,
        level,
        label,
        caller,
        path,
        levelColor,
        trace,
        ...meta
    } = info

    return `${getTime(timestamp)} ${level}: ${getLabel(label)}${getMessage(
        message,
    )}${getMeta(meta)}${getExecutorValues(caller, path, trace)}`
}

function getTime(timestamp: string): string {
    const time = new Date(timestamp).toISOString()

    return `${chalk.cyan(`[${`${time.substr(0, 10)} ${time.substr(11, 8)}`}]`)}`
}

function getMessage(message: string) {
    return typeof message === 'string'
        ? message
        : `\n${JSON.stringify(message, null, JSON_SPACE)}`
}

function getLabel(label: string): string {
    return `${label ? colorizeContext(label, '[' + label + '] ') : ''}`
}

function getExecutorValues(
    caller: string,
    path: string,
    trace: boolean,
): string {
    if (!trace) {
        return ``
    }

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
