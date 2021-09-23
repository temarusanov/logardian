# Logardian

## Quick start

**Logardian** - logger using Winston to output minimalistic, readable logs.

### Features:
 - Uses winston lib underneath
 - Various layers of logs that can be turned on/off via .env (`LOGARDIAN_LABELS`)
 - In production mode debug() does not work and all logs are sent in json format
 - Datetime in UTC format
 - Format of logs: `[time] [level] [layer] [message]`
 - In debug mode the path and name of the function that called the log is displayed
 - Can be used instead of NestJS Logger


### Examples
.env
```
NODE_ENV=development
LOGARDIAN_LABELS=database
```
file.ts
```ts
const logger = new Logardian()

logger.log(`Hi! I'm info log example`)
logger.warn(`Hi! I'm warn log example`, { trace: false })
logger.error(`Hi! I'm error log example`)
logger.verbose(`Hi! I'm verbose log example`, { label: 'database' })
logger.verbose(`Hi! I'm verbose log example #2`, { label: 'http' })
logger.debug(`Hi! I'm debug log example`, { some: 'object' })
```

output:

![](https://i.ibb.co/gVDG73q/image.png)