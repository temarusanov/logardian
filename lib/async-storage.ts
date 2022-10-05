import { AsyncHook, createHook, executionAsyncId } from 'async_hooks'
import { customAlphabet } from 'nanoid'

export class AsyncStorage {
    private storage: Map<number, string> = new Map()
    private nanoid = customAlphabet('1234567890abcdef', 12)
    private asyncHook: AsyncHook

    constructor() {
        const init = this._initStorage.bind(this)
        const destroy = this._destroyStorage.bind(this)
        this.asyncHook = createHook({ init, destroy })
        this.asyncHook.enable()
    }

    /**
     * Create trace id in Nodejs handler
     */
    createTraceId(traceId = this.nanoid()): string {
        this.storage.set(executionAsyncId(), traceId)

        return traceId
    }

    /**
     * Get trace id from Nodejs handler
     */
    getTraceId(): string | undefined {
        const asyncId = executionAsyncId()

        const isExistsTraceId = this.storage.has(asyncId)
        return !isExistsTraceId
            ? this.createTraceId()
            : this.storage.get(asyncId)
    }

    private _initStorage(asyncId: number, _: unknown, triggerAsyncId: number) {
        if (this.storage.has(triggerAsyncId)) {
            this.storage.set(asyncId, this.storage.get(triggerAsyncId))
        }
    }

    private _destroyStorage(asyncId: number) {
        if (this.storage.has(asyncId)) {
            this.storage.delete(asyncId)
        }
    }
}
