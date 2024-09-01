import {
    DeliveryInfoInterpreter, IInterpreter, OrderMetaInfoInterpreter,
    PaymentDetailInfoInterpreter,
    Platform,
    ReceiptInfo,
    RequestInfoInterpreter
} from '../types'

export class Interpreter implements IInterpreter {
    private readonly _platform: Platform
    private readonly _orderMetaInfoInterpreter: OrderMetaInfoInterpreter
    private readonly _deliveryInfoInterpreter: DeliveryInfoInterpreter
    private readonly _requestInfoInterpreter: RequestInfoInterpreter
    private readonly _paymentDetailInfoInterpreter: PaymentDetailInfoInterpreter

    constructor (platform: Platform, orderMetaInfoInterpreter: OrderMetaInfoInterpreter, deliveryInfoInterpreter: DeliveryInfoInterpreter, requestInfoInterpreter: RequestInfoInterpreter, paymentDeatilInfoInterpreter: PaymentDetailInfoInterpreter) {
        this._platform = platform
        this._orderMetaInfoInterpreter = orderMetaInfoInterpreter
        this._deliveryInfoInterpreter = deliveryInfoInterpreter
        this._requestInfoInterpreter = requestInfoInterpreter
        this._paymentDetailInfoInterpreter = paymentDeatilInfoInterpreter
    }

    public interpret (rawStr: string): ReceiptInfo {
        const raw = rawStr.split('\n\r')
        return new ReceiptInfo(
            this._platform,
            this._orderMetaInfoInterpreter.interpret(raw),
            this._deliveryInfoInterpreter.interpret(raw),
            this._requestInfoInterpreter.interpret(raw),
            this._paymentDetailInfoInterpreter.interpret(raw)
        )
    }
}
