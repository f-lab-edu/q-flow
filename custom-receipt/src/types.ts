import { Moment } from 'moment-timezone'

export enum Platform {
    BAEMIN,
    BAEMIN_1,
    YOGIYO,
    COUPANG
}

export class OptionInfo {
    optionName: string
    count: number
    price: number

    constructor (optionName: string, count: number, price: number) {
        this.optionName = optionName
        this.count = count
        this.price = price
    }
}

export class MenuInfo {
    menuName: string
    count: number
    price: number
    options: OptionInfo[] = []

    constructor (menuName: string, count: number, price: number, options: OptionInfo[]) {
        this.menuName = menuName
        this.count = count
        this.price = price
        this.options = options
    }
}

export class DeliveryInfo {
    phone: string | null
    singleAddress: string | null
    oldAddress: string | null
    newAddress: string | null

    constructor (
        phone: string | null,
        singleAddress: string | null,
        oldAddress: string | null,
        newAddress: string | null
    ) {
        this.phone = phone
        this.singleAddress = singleAddress
        this.oldAddress = oldAddress
        this.newAddress = newAddress
    }
}

export class OrderMetaInfo {
    shortOrderNumber: string
    fullOrderNumber: string
    payMethod: string
    orderAt: Moment

    constructor (
        shortOrderNumber: string,
        longOrderNumber: string,
        payMethod: string,
        orderAt: Moment
    ) {
        this.shortOrderNumber = shortOrderNumber
        this.fullOrderNumber = longOrderNumber
        this.payMethod = payMethod
        this.orderAt = orderAt
    }
}

export class RequestInfo {
    store: string
    rider: string
    environment: boolean

    constructor (
        store: string,
        rider: string,
        environment: boolean
    ) {
        this.store = store
        this.rider = rider
        this.environment = environment
    }
}

export class PaymentDetailInfo {
    menuList: MenuInfo[]
    deliveryTip: number
    totalPrice: number
    extraPaymentNotice: string | null

    constructor (menuList: MenuInfo[], deliveryTip: number, totalPrice: number, extraPaymentNotice: string | null = null) {
        this.menuList = menuList
        this.deliveryTip = deliveryTip
        this.totalPrice = totalPrice
        this.extraPaymentNotice = extraPaymentNotice
    }
}

export class ReceiptInfo {
    platform: number
    orderMetaInfo: OrderMetaInfo
    deliveryInfo: DeliveryInfo
    requestInfo: RequestInfo
    paymentDetailInfo: PaymentDetailInfo

    constructor (
        platform: number,
        orderMetaInfo: OrderMetaInfo,
        deliveryInfo: DeliveryInfo,
        requestInfo: RequestInfo,
        paymentDetailInfo: PaymentDetailInfo
    ) {
        this.platform = platform
        this.orderMetaInfo = orderMetaInfo
        this.deliveryInfo = deliveryInfo
        this.requestInfo = requestInfo
        this.paymentDetailInfo = paymentDetailInfo
    }
}

export interface IInterpreter {
    interpret(raw: string): ReceiptInfo
}

export interface OrderMetaInfoInterpreter {
    interpret(raw: string[]): OrderMetaInfo
}

export interface DeliveryInfoInterpreter {
    interpret(raw: string[]): DeliveryInfo
}

export interface RequestInfoInterpreter {
    interpret(raw: string[]): RequestInfo
}

export interface PaymentDetailInfoInterpreter {
    interpret(raw: string[]): PaymentDetailInfo
}

export interface IPrinter {
    print(receiptInfo: ReceiptInfo): Promise<void>
}
