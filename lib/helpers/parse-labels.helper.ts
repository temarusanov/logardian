// eslint-disable-next-line
require('dotenv').config()
const SUBSTRING_NOT_FOUND = -1
const labels = process.env.LOGARDIAN_LABELS

export const parseLabels = (): string[] => {
    if (!labels) {
        return []
    }

    if (labels.indexOf('*') > SUBSTRING_NOT_FOUND) {
        return ['*']
    }

    return labels.split(',')
}
