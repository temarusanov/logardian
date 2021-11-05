/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
import { LogMethodOptions } from './interfaces/log-method-options.interface'
import { LoggerConfig } from './interfaces/logger-options.interface'
import { Logger } from './logger'

export class Logardian {
    private static _instance: Logger

    private get _instance(): Logger {
        if (!Logardian._instance) {
            Logardian._instance = new Logger()
        }

        return Logardian._instance
    }

    configure(config: LoggerConfig): void {
        if (Object.keys(config).length === 0) {
            return
        }

        this._instance._config = config
    }

    log(message: any, options?: LogMethodOptions): void
    log(message: any, ...optionalParams: [...any, string?]): void
    log(message: any, ...optionalParams: any[]): void {
        this._instance.log(message, ...optionalParams)
    }

    error(message: any, options?: LogMethodOptions): void
    error(message: any, ...optionalParams: [...any, string?, string?]): void
    error(message: any, ...optionalParams: any[]): void {
        this._instance.error(message, ...optionalParams)
    }

    warn(message: any, options?: LogMethodOptions): void
    warn(message: any, ...optionalParams: [...any, string?]): void
    warn(message: any, ...optionalParams: any[]): void {
        this._instance.warn(message, ...optionalParams)
    }

    debug(message: any, options?: LogMethodOptions): void
    debug(message: any, ...optionalParams: [...any, string?]): void
    debug(message: any, ...optionalParams: any[]): void {
        this._instance.debug(message, ...optionalParams)
    }

    verbose(message: any, options?: LogMethodOptions): void
    verbose(message: any, ...optionalParams: [...any, string?]): void
    verbose(message: any, ...optionalParams: any[]): void {
        this._instance.verbose(message, ...optionalParams)
    }
}
