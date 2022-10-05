import { LogLevel } from "./logger.interface"

export interface DefaultLog {
    message: string
    level: LogLevel
    label: string
    stack?: string
    trace?: boolean
}