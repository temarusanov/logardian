/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger as WinstonLogger } from 'winston'
import { getFunctionTrace } from './helpers/get-function-trace.helper'
import { createWinstonLogger } from './helpers/create-winston-logger.helper'
import { IsLabelEnabled } from './decorators/is-label-enabled.decorator'
import { parseLabels } from './helpers/parse-labels.helper'

const labels = parseLabels()

/**
 * Feature:
 * - Uses winston lib underneath
 * - Various layers of logs that can be turned on/off via .env (`LOGARDIAN_LABELS`)
 * - In production mode debug() does not work and all logs are sent in json format
 * - Datetime in UTC format
 * - Format of logs: `[time] [level] [layer] [message]`
 * - In debug mode the path and name of the function that called the log is displayed
 * - Can be used instead of NestJS Logger
 *
 * Logger config
 *
 * `label: string` - Displays the log label
 *
 * `trace: boolean` - Displays the name of the function that called the log and the path to it.
 * By default, **debug**, **error**, and **warn** are enabled. Disabled in production mode
 *
 * Examples:
 * ```
 * const logger = new Logardian()
 *
 * logger.error(`User not found`, { label: 'Users', trace: false })
 * // output: [22-09-2021 12:07:06] error: [Users] User not found
 *
 * logger.debug(transaction, { label: 'Transactions' })
 * // [22-09-2021 12:10:33] debug: [Transactions] New transaction
 * // {
 * //  "from": "user1",
 * //  "to": "user2",
 * //  "amount": "200"
 * // }
 * // caller -> bootstrap
 * // path -> /home/tema/Documents/GitHub/evr-core/src/main.ts:34:12
 * ```
 */
export class Logardian {
    private _output: WinstonLogger

    constructor() {
        this._output = createWinstonLogger()
    }

    @IsLabelEnabled(labels)
    log(message: any, ...optionalParams: any[]): void {
        const functionExecutor = getFunctionTrace('info', optionalParams)

        this._output.info(message, ...[functionExecutor, ...optionalParams])
    }

    @IsLabelEnabled(labels)
    error(message: any, ...optionalParams: any[]): void {
        const functionExecutor = getFunctionTrace('error', optionalParams)

        this._output.error(message, ...[functionExecutor, ...optionalParams])
    }

    @IsLabelEnabled(labels)
    warn(message: any, ...optionalParams: any[]): void {
        const functionExecutor = getFunctionTrace('warn', optionalParams)

        this._output.warn(message, ...[functionExecutor, ...optionalParams])
    }

    @IsLabelEnabled(labels)
    debug(message: any, ...optionalParams: any[]): void {
        const functionExecutor = getFunctionTrace('debug', optionalParams)

        this._output.debug(message, ...[functionExecutor, ...optionalParams])
    }

    @IsLabelEnabled(labels)
    verbose(message: any, ...optionalParams: any[]): void {
        const functionExecutor = getFunctionTrace('verbose', optionalParams)

        this._output.verbose(message, ...[functionExecutor, ...optionalParams])
    }
}

export default Logardian
