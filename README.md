# Logardian

Logger using Winston to output minimalistic, readable logs.


## Roadmap

- Logstash support

- Logging to file

  
## Installation

Requires node version >=12.х

```bash
npm i --save logardian
```
    
## Features

- Uses [winston](https://github.com/winstonjs/winston) lib underneath
- Various layers of logs that can be turned on/off via .env (`LOGARDIAN_LABELS`)
- In production mode debug() does not work and all logs are sent in json format
- Datetime in UTC format
- Format of logs: `[time] [level] [layer] [message]`
- In debug mode the path and name of the function that called the log is displayed
- Can be used instead of NestJS Logger
- Can log any objects, arrays, variables

  
## Usage/Examples



```ts
import Logardian from 'logardian'

const logger = new Logardian()

logger.log(`Hi! I'm info log example`)
logger.warn(`Hi! I'm warn log example`, { trace: false })
logger.error(`Hi! I'm error log example`)
logger.verbose(`Hi! I'm verbose log example`, { label: 'database' })
logger.debug(`Hi! I'm debug log example`, { some: 'object' })
```

***development output:***

![](https://i.ibb.co/y63BtzS/image.png)


***production output:***

```bash
{
  "timestamp": "2021-09-30T09:45:01.035Z",
  "message": "Hi! I'm info log example",
  "level": "info",
  "metadata": {}
}
{
  "timestamp": "2021-09-30T09:45:01.035Z",
  "message": "Hi! I'm warn log example",
  "level": "warn",
  "metadata": {}
}
{
  "timestamp": "2021-09-30T09:45:01.035Z",
  "message": "Hi! I'm error log example",
  "level": "error",
  "metadata": {}
}
```

## Environment Variables

`NODE_ENV` production start does not show debug() logs

`LOGARDIAN_LABELS` labels to be logged in the console. For example *LOGARDIAN_LABELS=database,http*

`LOGARDIAN_TRACE` turn off default function callers logs (debug, warn, error)

  
## FAQ

#### How does it implement NestJS Logger without any framework libs?

We made logger based on [LoggerService](https://github.com/nestjs/nest/blob/master/packages/common/services/logger.service.ts) but we don't explicitly implement so that we stay dependless of NestJS libraries. But you can also use the Logardian instead of common NestJS logger.

```ts
// main.ts
import Logardian from 'logardian'

const logger = new Logardian()

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { logger })

    await app.listen(port, hostname, () =>
        logger.log(`Server running at ${hostname}:${port}`),
    )
}
```

#### Does production mode include objects that I log?

Yes, logs have 'metadata' field that include all object except 
*timestamp*, *level*, *label*, *message*.

**Important:** production will never log caller and path fields (trace)

```ts
logger.log(`User ${user.name} has new transaction`, transaction, { trace: true })
```
```json
{
  "timestamp": "2021-09-24T04:03:27.326Z",
  "level": "info",
  "message": "User Tema has new transaction",
  "metadata": {
    "from": "user-name-1",
    "to": "user-name-2",
    "amount": "137"
  },
}
```

#### How can I use logardian in my service?

Simply create a new logger class

```ts
import Logardian from 'logardian'

@Injectable()
export class CatService {
    private readonly _logger = new Logardian()
}
```

#### I do not see my logs with label

Specify labels you want to log in *.env* or write `*` to log every log with label. 
Working in production and development mode

```bash
LOGARDIAN_LABELS=* # output every log with label
LOGARDIAN_LABELS=http,database # output log with http and database labels
LOGARDIAN_LABELS=emails,* # output every log with label
```

#### I do not want to see caller and path. How can I turn off them globally?

Specify 'false' on LOGARDIAN_TRACE in *.env*. If you specify `trace: true` in logger function trace will log in spite of .env option

```bash
LOGARDIAN_TRACE=false
```

Priority of trace from high to low:

1. Production mode
2. `trace: true` in function config
3. `LOGARDIAN_TRACE=false` in .env



## License

[MIT](https://github.com/i-link-pro-team/logardian/blob/main/LICENSE)

  