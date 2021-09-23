/* eslint-disable */
export function IsLabelEnabled(enabledLabels: string[]) {
    return function logMethod(
        target: any,
        propertyName: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value

        descriptor.value = function () {
            const args: any = arguments
            const [_message, ...metas] = args

            const labelObject = metas.find(
                (meta: any) => typeof meta === 'object' && 'label' in meta,
            )

            if (
                !labelObject ||
                enabledLabels.includes('*') ||
                enabledLabels.includes(labelObject.label)
            ) {
                method.apply(this, args)
            }
        }

        return descriptor
    }
}
