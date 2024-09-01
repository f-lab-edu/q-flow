import { IInterpreter, Platform } from '../types'
import { BaeminOrderMetaInfoInterpreter } from './baemin/order-meta-info-interpreter'
import { Interpreter } from './interpreter'
import { BaeminDeliveryInfoInterpreter } from './baemin/delivery-info-interpreter'
import { BaeminRequestInfoInterpreter } from './baemin/request-info-interpreter'
import { BaeminPaymentDetailInfoInterpreter } from './baemin/payment-detail-info-interpreter'

export class InterpreterFactory {
    private readonly _baeminInterpreter: IInterpreter

    constructor () {
        this._baeminInterpreter = new Interpreter(
            Platform.BAEMIN,
            new BaeminOrderMetaInfoInterpreter(),
            new BaeminDeliveryInfoInterpreter(),
            new BaeminRequestInfoInterpreter(),
            new BaeminPaymentDetailInfoInterpreter()
        )
    }

    private _detectPlatform (rawData: string) {
        if (rawData.includes('배민1 주문전표')) {
            return Platform.BAEMIN_1
        } else if (rawData.includes('배달 주문전표')) {
            return Platform.BAEMIN
        }
    }

    public getInterpreter (raw: string): IInterpreter {
        switch (this._detectPlatform(raw)) {
        case Platform.BAEMIN:
            return this._baeminInterpreter
        }
        throw new Error('Can not find interpreter')
    }
}
