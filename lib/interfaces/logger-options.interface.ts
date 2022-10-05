export interface LoggerConfig {
    /**
     * Put labels with will be show in console
     */
    labels?: string | string[] | false

    /**
     * Trace with error path in the end of the log
     */
    trace?: boolean

    /**
     * Output in json message
     */
    json?: boolean

    /**
     * Use async hooks to trace your logs
     */
    traceId?: boolean

    colors?: {
        timestamp?: string
        traceId?: string
        label?: string
        message?: string
        trace?: string
        stack?: string
    }
}
