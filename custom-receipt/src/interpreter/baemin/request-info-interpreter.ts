import { RequestInfo, RequestInfoInterpreter } from '../../types'

export class BaeminRequestInfoInterpreter implements RequestInfoInterpreter {
    public interpret (raw: string[]) {
        let storeRequest = null
        let riderRequest = null
        let envRequest = null
        for (const [index, data] of raw.entries()) {
            if (!storeRequest && data.includes('가게 : ')) {
                storeRequest = data.replace('가게 : ', '')
                continue
            }
            if (!riderRequest && data.includes('배달 : ')) {
                riderRequest = data.replace('배달 : ', '')
                continue
            }
            if (!envRequest && data.includes('친환경:')) {
                if (raw[index + 1].includes('X')) {
                    envRequest = false
                } else {
                    envRequest = true
                }
            }
        }
        if (!(storeRequest && riderRequest && envRequest)) {
            throw new Error('Baemin RequestInfo Interpreting Failed')
        }
        return new RequestInfo(
            storeRequest,
            riderRequest,
            envRequest
        )
    }
}
