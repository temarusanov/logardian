export interface LoggerConfig {
    /**
     * Put labels with will be show in console
     * @notice Default: `*`
     */
    labels?: string | string[] | false

    /**
     * Trace with error path in the end of the log
     * @notice Default: `false`
     */
    trace?: boolean

    /**
     * @notice Default: `false`
     */
    json?: boolean

    /**
     * Use async hooks to trace your logs
     * @notice Default: `true`
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
