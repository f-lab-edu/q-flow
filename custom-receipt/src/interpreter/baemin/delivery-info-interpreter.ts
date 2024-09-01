import { DeliveryInfo, DeliveryInfoInterpreter } from '../../types'

export class BaeminDeliveryInfoInterpreter implements DeliveryInfoInterpreter {
    public interpret (raw: string[]) {
        const oldAddressLine = raw[5]
        const newAddressLine = raw[6]
        const phone = raw[9]
        return new DeliveryInfo(
            phone,
            null,
            oldAddressLine,
            newAddressLine
        )
    }
}
