# Logardian

Inspired by NestJS Logger, Logardian was built to output minimalistic, readable logs.

## Roadmap

- [x] Async hooks
- [x] NodeJS v16.17.1
- [ ] Logging to file

## Installation

> Note: Logardian with version 3.0.0 or higher requires NodeJS 16+ because of async hooks. If you don't want them downgrade to version 2.1.0

```bash
npm i --save logardian
```
    
## Features

- Various layers of logs that can be turned on/off via config
- In production mode debug() does not work
- Datetime in UTC format
- Format of logs: `[time] [level] [layer] [message]`
- In debug mode the path and name of the function that called the log is displayed
- Can be used instead of NestJS Logger
- Can log any objects, arrays, variables
- Modes: normal or json format output
- Async hook storage for trace ID
- Colors!

  
## Usage/Examples

```ts
import Logardian from 'logardian'

const logger = new Logardian()

logger.configure({
    trace: false
})

logger.log(`Hi! I'm info log example`)
logger.warn(`Hi! I'm warn log example`, { trace: false })
logger.error(`Hi! I'm error log example`)
logger.verbose(`Hi! I'm verbose log example`, { label: 'database' })
logger.debug(`Hi! I'm debug log example`, { some: 'object' })
```

### Default output

![](./images/logs.png)


### Json output

```ts
logger.configure({
    json: true
})
```

```bash
{"timestamp":"2021-11-05T05:54:10.920Z","message":"Hi! I'm info log example","level":"log"}
{"timestamp":"2021-11-05T05:54:10.920Z","message":"Hi! I'm warn log example","level":"warn"}
{"timestamp":"2021-11-05T05:54:10.920Z","message":"Hi! I'm error log example","level":"error"}
{"timestamp":"2021-11-05T05:54:10.920Z","message":"Hi! I'm verbose log example","level":"verbose","label":"database"}
{"timestamp":"2021-11-05T05:54:10.920Z","message":"{\n\"some\":\"object\"\n}","level":"debug"}
```

### Labels

Labels now support glob patterns! You can dynamically enable and disable the logs you need via `logger.configure()`. For example:

```ts
import { Logardian } from 'logardian'

const logger = new Logardian()

logger.configure({
    labels: ['users.*']
})

logger.log('User sent mail', { label: 'users.email' }) // will log
logger.log('User registered', { label: 'users.auth.registration' }) // will log
logger.log('User authorized', { label: 'users.auth.authorization' }) // will log
logger.log('Database connected', { label: 'database' }) // will NOT log
logger.log('User entity created', { label: 'database.users' }) // will NOT log
```

### Async hook storage

Use async hooks to group your logs in one stream. Works out of the box! You can turn them off in the `configure()` function

```ts
// your create user logic

logger.log('User has been created')
// [2022-10-05 11:34:41.621] [6f952d18bbf9] log: User has been created
//                                    ^ unique trace id

// your send email for user logic here

logger.log('Email for user was sent')
// [2022-10-05 11:34:47.317] [6f952d18bbf9] log: Mail for user was sent
//                                    ^ same trace id
```

Or provide your own trace ID

```ts
logger.createTraceId('my-super-trace-id')
// [2022-10-05 11:34:47.317] [my-super-trace-id] log: Mail for user was sent
```

## Environment Variables

`NODE_ENV` production start does not show debug() logs

## FAQ

#### How does it implement NestJS Logger without any framework libs?

We made logger based on [LoggerService](https://github.com/nestjs/nest/blob/master/packages/common/services/logger.service.ts) but we don't explicitly import it so that we stay dependless of NestJS libraries. But you can also use the Logardian instead of common NestJS logger.

```ts
// main.ts
import { Logardian } from 'logardian'

const logger = new Logardian()

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { logger })

    await app.listen(port, hostname, () =>
        logger.log(`Server running at ${hostname}:${port}`),
    )
}
```

#### How can I use logardian in my service?

Simply create a new logger class

```ts
import { Logardian } from 'logardian'

@Injectable()
export class CatService {
    private readonly _logger = new Logardian()
}
```

#### I do not see my logs with label

Specify labels you want to log or write `*` to log every log with label. 
Working in production and development mode

Logardian is a singleton, so it means that `configure()` works on all Logardian instances

```ts
import { Logardian } from 'logardian'

const logger = new Logardian()

logger.configure({
    labels: '*', // or ['database', 'events'] or false
    trace: false,
    json: true,
    traceId: true
})
```

#### I do not want to see caller and path. How can I turn off them globally?

Specify 'false' on logardian config. If you specify `trace: true` in logger function trace will log in spite of config option

Priority of trace from high to low:

1. Production mode
2. `logger.log('Hello', { trace: true })`
3. `logger.configure({ trace: false })`



## License


[MIT](https://github.com/i-link-pro-team/logardian/blob/main/LICENSE)

  