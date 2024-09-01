import { PDFDocumentWithTables } from './utils/PDFDocumentWithTables'
import fs from 'fs'
import { WinPrinter } from './utils/node-native-printer/src/windowsPrinter'
import {
    DeliveryInfo,
    IPrinter,
    MenuInfo,
    OrderMetaInfo,
    PaymentDetailInfo,
    Platform,
    ReceiptInfo,
    RequestInfo
} from './types'
import PDFKit from 'pdfkit'
import { defaultFont } from './font/font-info'
import { Moment } from 'moment-timezone'

export class Printer implements IPrinter {
    private _drawDivider (doc: PDFKit.PDFDocument, text?: string) {
        if (text) {
            const targetY = doc.y
            doc.fontSize(30).moveTo(0, targetY)
                .lineTo(230, targetY)
                .stroke()
                .text(text, 240, targetY - 15, {
                    paragraphGap: 10
                })
            doc.moveTo(360, targetY)
                .lineTo(600, targetY)
                .stroke()
        } else {
            doc.moveTo(0, doc.y)
                .lineTo(600, doc.y)
                .stroke()
        }
    }

    private _getTitleText (platform: Platform) {
        if (platform === Platform.BAEMIN) {
            return '홈팝콘 배민 주문 전표'
        } else if (platform === Platform.YOGIYO) {
            return '홈팝콘 요기요 주문 전표'
        } else if (platform === Platform.COUPANG) {
            return '홈팝콘 쿠팡 주문 전표'
        }
        throw new Error('Unhandled Platform')
    }

    private _writeTitle (doc: PDFKit.PDFDocument, platform: Platform) {
        doc.font(defaultFont).fontSize(55).text(this._getTitleText(platform), {
            align: 'center',
            lineGap: 20
        })
    }

    private _writeOrderMetaInfo (doc: PDFKit.PDFDocument, orderMetaInfo: OrderMetaInfo) {
        this._drawDivider(doc, '주문 정보')
        doc
            .font(defaultFont)
            .fontSize(50)
            .text(`주문 번호: ${orderMetaInfo.shortOrderNumber}`, 0)
        doc
            .font(defaultFont)
            .text(`결제 방법: ${orderMetaInfo.payMethod}`, {
                lineGap: 15
            })
    }

    private _writeDeliveryInfo (doc: PDFKit.PDFDocument, deliveryInfo: DeliveryInfo) {
        this._drawDivider(doc, '배송 정보')
        doc
            .font(defaultFont)
            .fontSize(50)
            .text(`지번: ${deliveryInfo.singleAddress}`, 0, undefined, {
                paragraphGap: 5
            })
        doc
            .font(defaultFont)
            .fontSize(45)
            .text(`도로명: ${deliveryInfo.newAddress}`, {
                paragraphGap: 10
            })
        doc
            .font(defaultFont)
            .fontSize(45)
            .text(`연락처: ${deliveryInfo.phone}`, {
                paragraphGap: 5
            })
        doc
            .font(defaultFont)
            .fontSize(30)
            .text('안심번호는 주문접수 후 최대 3시간 동안 유효합니다.')
        doc
            .font(defaultFont)
            .fontSize(30)
            .text('고객정보를 배달목적 외 사용하거나 보관, 공개할 경우 법적처벌을 받을 수 있습니다.', {
                paragraphGap: 15
            })
    }

    private _writeRequestInfo (doc: PDFKit.PDFDocument, requestInfo: RequestInfo) {
        this._drawDivider(doc, '요청 사항')
        doc
            .font(defaultFont)
            .fontSize(50)
            .text(`가게: ${requestInfo.store}`, 0, undefined, {
                paragraphGap: 5
            })
        doc
            .font(defaultFont)
            .text(`배달: ${requestInfo.rider}`, {
                lineGap: 15
            })
    }

    private _generateMenuRows (menuList: MenuInfo[]) {
        return menuList.reduce<string[][]>((prev, menu) => {
            const rows: string[][] = []
            rows.push([menu.menuName, menu.count.toString(), menu.price.toLocaleString()])
            for (const option of menu.options) {
                rows.push([` + ${option.optionName}`, '', option.price ? option.price.toLocaleString() : ''])
            }
            return [...prev, ...rows]
        }, [])
    }

    private _writePaymentDetail (doc: PDFDocumentWithTables, paymentDetailInfo: PaymentDetailInfo) {
        this._drawDivider(doc, '주문 메뉴')
        const rows = this._generateMenuRows(paymentDetailInfo.menuList)
        rows.push(['배달팁', '', paymentDetailInfo.deliveryTip.toLocaleString()])
        rows.push(['합계', '', paymentDetailInfo.totalPrice.toLocaleString()])
        const
            table0 = {
                headers: ['메뉴', '수량', '가격'],
                rows
            }
        doc
            .table(table0, undefined, undefined, undefined)
    }

    private _writeExtraInfo (doc: PDFKit.PDFDocument, fullOrderNumber: string, orderedAt: Moment) {
        this._drawDivider(doc, '      ')
        doc
            .font(defaultFont)
            .fontSize(30)
            .text(`주문 번호: ${fullOrderNumber}`, 0, undefined, {
                paragraphGap: 5
            })
        doc
            .font(defaultFont)
            .fontSize(30)
            .text(`주문 일시: ${orderedAt.format('YYYY.MM.DD. HH:mm')}`, 0, undefined, {
                paragraphGap: 18
            })
    }

    private _writeOrigin (doc: PDFKit.PDFDocument) {
        this._drawDivider(doc, '  원산지')
        doc
            .font(defaultFont)
            .fontSize(30)
            .text('버터구이오징어(오징어: 페루산), 치킨(닭고기:브라질산,미국산,덴마크산 섞음),붕어빵(쌀가루: 국내산, 팥앙금: 중국산)', 0, undefined, {
                paragraphGap: 18
            })
    }

    private _writeNotice (doc: PDFKit.PDFDocument) {
        this._drawDivider(doc, '안내 사항')
        doc
            .font(defaultFont)
            .fontSize(30)
            .text('주문해주셔서 감사합니다. 혹여나 음식 또는 배송에 문제가 있었다면, 070-7774-0007로 연락 주세요! 최대한 빠르게 처리해드리겠습니다.', 0, undefined, {
                paragraphGap: 10
            })
        doc
            .font(defaultFont)
            .fontSize(30)
            .text('홈팝콘의 서비스에 대한 의견이나 개선 사항을 전달하고 싶으시다면 아래 카카오톡 채널 또는 인스타그램 DM으로 전달 부탁드립니다! 보내주신 의견은 서비스 품질 향상을 위해 소중히 경청하겠습니다!', {
                paragraphGap: 10
            })
        const currentY = doc.y
        doc.image('src/images/kakao-qr.png', 0, currentY, {
            align: 'center',
            width: 200
        })
        doc.image('src/images/instagram-qr.png', 400, currentY, {
            align: 'center',
            width: 200
        })
    }

    private _write (doc: PDFDocumentWithTables, receiptInfo: ReceiptInfo) {
        this._writeTitle(doc, receiptInfo.platform)
        this._writeOrderMetaInfo(doc, receiptInfo.orderMetaInfo)
        this._writeDeliveryInfo(doc, receiptInfo.deliveryInfo)
        this._writeRequestInfo(doc, receiptInfo.requestInfo)
        this._writePaymentDetail(doc, receiptInfo.paymentDetailInfo)
        this._writeExtraInfo(doc, receiptInfo.orderMetaInfo.fullOrderNumber, receiptInfo.orderMetaInfo.orderAt)
        this._writeOrigin(doc)
        this._writeNotice(doc)
    }

    private _getPrintResultHeight (receiptInfo: ReceiptInfo) {
        const tempDoc = new PDFDocumentWithTables({
            size: [600, 5000],
            margin: 0
        })
        this._write(tempDoc, receiptInfo)
        tempDoc.end()
        return tempDoc.y + 50
    }

    public async print (receiptInfo: ReceiptInfo) {
        const outputPath = `${Math.random()}.pdf`
        const doc = new PDFDocumentWithTables({
            size: [600, this._getPrintResultHeight(receiptInfo)],
            margin: 0
        })

        doc.pipe(fs.createWriteStream(outputPath))
        this._write(doc, receiptInfo)
        doc.end()

        setTimeout(async () => {
            const printer = new WinPrinter()
            printer.setPrinter('SLK-TS100 (copy 1)')
            await printer.print(outputPath)
            fs.unlinkSync(outputPath)
        }, 1000)
    }
}
