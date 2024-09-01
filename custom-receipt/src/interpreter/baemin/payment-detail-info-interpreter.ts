import { MenuInfo, OptionInfo, PaymentDetailInfo, PaymentDetailInfoInterpreter } from '../../types'

export class BaeminPaymentDetailInfoInterpreter implements PaymentDetailInfoInterpreter {
    private _extractBaeminMenuLines (splitedData: string[]) {
        let startLineIndex = null
        let endLineIndex = null
        for (const [index, lineData] of splitedData.entries()) {
            if (!startLineIndex) {
                if (lineData.includes('메뉴명') && lineData.includes('수량') && lineData.includes('금액')) {
                    startLineIndex = index
                }
                continue
            }
            if (lineData.includes('배달팁')) {
                endLineIndex = index
            }
        }
        return splitedData.slice(startLineIndex as number + 2, endLineIndex as number)
    }

    private _getMenuInfoFromMenuLine (menuLine: string) {
        const [menuName, count, price] = menuLine.split('  ').filter(data => data !== '').map(data => data.trim())
        return new MenuInfo(menuName, Number(count), Number(price.replace(',', '')), [])
    }

    private _getOptionInfoFromOptionLine (optionLine: string) {
        const [optionName, price] = optionLine.slice(3).split('  ').filter(data => data !== '').map(data => data.trim())
        return new OptionInfo(optionName, 1, price ? Number(price.replace(',', '')) : 0)
    }

    private _getBaeminMenuList (raw: string[]) {
        const menuLines = this._extractBaeminMenuLines(raw)
        const menuList: MenuInfo[] = []
        for (const menuLine of menuLines) {
            if (menuLine.includes('+')) {
                menuList[menuList.length - 1].options.push(this._getOptionInfoFromOptionLine(menuLine))
                continue
            }
            menuList.push(this._getMenuInfoFromMenuLine(menuLine))
        }
        return menuList
    }

    private _getDeliveryTip (raw: string[]) {
        const tipLine = raw[raw.length - 14]
        return Number(tipLine.slice(tipLine.length - 5, tipLine.length).trim().replace(',', ''))
    }

    private _getTotalPrice (raw: string[]) {
        const totalPriceLine = raw[raw.length - 12]
        return Number(totalPriceLine.slice(totalPriceLine.length - 7, totalPriceLine.length).trim().replace(',', ''))
    }

    public interpret (raw: string[]): PaymentDetailInfo {
        return new PaymentDetailInfo(this._getBaeminMenuList(raw), this._getDeliveryTip(raw), this._getTotalPrice(raw))
    }
}
