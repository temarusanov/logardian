/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerOptions } from './interfaces/logger-options.interface'
import { Logger } from './logger'

export class Logardian {
    private static _instance: Logger

    private get _instance(): Logger {
        if (!Logardian._instance) {
            Logardian._instance = new Logger()
        }

        return Logardian._instance
    }

    log(message: any, options?: LoggerOptions): void
    log(message: any, ...optionalParams: [...any, string?]): void
    log(message: any, ...optionalParams: any[]): void {
        this._instance.log(message, ...optionalParams)
    }

    error(message: any, options?: LoggerOptions): void
    error(message: any, ...optionalParams: [...any, string?, string?]): void
    error(message: any, ...optionalParams: any[]): void {
        this._instance.error(message, ...optionalParams)
    }

    warn(message: any, options?: LoggerOptions): void
    warn(message: any, ...optionalParams: [...any, string?]): void
    warn(message: any, ...optionalParams: any[]): void {
        this._instance.warn(message, ...optionalParams)
    }

    debug(message: any, options?: LoggerOptions): void
    debug(message: any, ...optionalParams: [...any, string?]): void
    debug(message: any, ...optionalParams: any[]): void {
        this._instance.debug(message, ...optionalParams)
    }

    verbose(message: any, options?: LoggerOptions): void
    verbose(message: any, ...optionalParams: [...any, string?]): void
    verbose(message: any, ...optionalParams: any[]): void {
        this._instance.verbose(message, ...optionalParams)
    }
}
