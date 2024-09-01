import moment from 'moment-timezone'
import { OrderMetaInfo, OrderMetaInfoInterpreter } from '../../types'

export class BaeminOrderMetaInfoInterpreter implements OrderMetaInfoInterpreter {
    private _getPaymentMethod (raw: string[]) {
        const paymentMethodLine = raw[2]
        return paymentMethodLine.split(' ').slice(1).join('').trim()
    }

    private _getOrderedAt (raw: string[]) {
        return moment(raw[raw.length - 9], 'YYYY.MM.DD. HH:mm')
    }

    private _getOrderNumber (raw: string[]) {
        let shortOrderNumber
        let longOrderNumber
        for (const data of raw) {
            if (data.includes('주문번호')) {
                if (!shortOrderNumber) {
                    shortOrderNumber = data.split(' ')[1]
                }
                if (!longOrderNumber) {
                    longOrderNumber = data.split(':')[1]
                }
            }
        }
        if (!(shortOrderNumber && longOrderNumber)) {
            throw new Error('Can not find order number')
        }
        return {
            shortOrderNumber,
            longOrderNumber
        }
    }

    public interpret (raw: string[]) {
        const paymentMethod = this._getPaymentMethod(raw)
        const orderAt = this._getOrderedAt(raw)
        const { shortOrderNumber, longOrderNumber } = this._getOrderNumber(raw)
        return new OrderMetaInfo(shortOrderNumber, longOrderNumber, paymentMethod, orderAt)
    }
}
