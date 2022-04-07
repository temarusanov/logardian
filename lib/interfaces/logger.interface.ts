/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'timer'

/**
 * Logger interface from NestJS
 * https://github.com/nestjs/nest/blob/master/packages/common/services/logger.service.ts
 */
export interface LoggerInterface {
    log(message: any, ...optionalParams: any[]): any
    error(message: any, ...optionalParams: any[]): any
    warn(message: any, ...optionalParams: any[]): any
    debug?(message: any, ...optionalParams: any[]): any
    verbose?(message: any, ...optionalParams: any[]): any
    setLogLevels?(levels: LogLevel[]): any
}
