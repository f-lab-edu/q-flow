/* eslint-env mocha */
import chai from 'chai'
import sinonChai from 'sinon-chai'
import { sampleBaeminData } from './sampleData'
import { InterpreterFactory } from '../interpreter/interpreter-factory'

chai.use(sinonChai)
const expect = chai.expect
describe('Interpreter', () => {
    describe('BaeminInterpreter', () => {
        it('배민 인터프리터', () => {
            const rawData = sampleBaeminData
            const interpreter = new InterpreterFactory().getInterpreter(rawData)

            const interpretResult = interpreter.interpret(rawData)

            expect(interpretResult.platform).to.be.eql(0)
            expect(interpretResult.orderMetaInfo.shortOrderNumber).to.be.eql('W4NE')
            expect(interpretResult.orderMetaInfo.fullOrderNumber).to.be.eql('B1EE01W4NE')
            expect(interpretResult.orderMetaInfo.payMethod).to.be.eql('결제완료')
            expect(interpretResult.orderMetaInfo.orderAt.format('YYYY.MM.DD HH:mm')).to.be.eql('2022.12.20 21:53')

            expect(interpretResult.requestInfo.store).to.be.eql('리뷰이벤트할게요 카라멜 팝콘 부탁드려요 huseong2')
            expect(interpretResult.requestInfo.rider).to.be.eql('조심히 안전하게 와주세요 :)')
            expect(interpretResult.requestInfo.environment).to.be.eql(true)

            expect(interpretResult.deliveryInfo.oldAddress).to.be.eql('서울 노원구 공릉동 702 103동 107호')
            expect(interpretResult.deliveryInfo.newAddress).to.be.eql('서울 노원구 동일로 1127 103동 107호')
            expect(interpretResult.deliveryInfo.phone).to.be.eql('050-37366-5830')

            expect(interpretResult.paymentDetailInfo.menuList[0].menuName).to.be.eql('오징어버터구이 몸통')
            expect(interpretResult.paymentDetailInfo.menuList[0].price).to.be.eql(4900)
            expect(interpretResult.paymentDetailInfo.menuList[0].count).to.be.eql(1)
            expect(interpretResult.paymentDetailInfo.menuList[0].options.length).to.be.eql(1)
            expect(interpretResult.paymentDetailInfo.menuList[0].options[0].optionName).to.be.eql('이 메뉴는 일회용품 O')
            expect(interpretResult.paymentDetailInfo.menuList[0].options[0].price).to.be.eql(0)
            expect(interpretResult.paymentDetailInfo.menuList[0].options[0].count).to.be.eql(1)

            expect(interpretResult.paymentDetailInfo.menuList[1].menuName).to.be.eql('치즈 팝콘')
            expect(interpretResult.paymentDetailInfo.menuList[1].price).to.be.eql(4200)
            expect(interpretResult.paymentDetailInfo.menuList[1].count).to.be.eql(1)
            expect(interpretResult.paymentDetailInfo.menuList[1].options.length).to.be.eql(1)
            expect(interpretResult.paymentDetailInfo.menuList[1].options[0].optionName).to.be.eql('레귤러 (Regular)')
            expect(interpretResult.paymentDetailInfo.menuList[1].options[0].price).to.be.eql(0)
            expect(interpretResult.paymentDetailInfo.menuList[1].options[0].count).to.be.eql(1)

            expect(interpretResult.paymentDetailInfo.deliveryTip).to.be.eql(3500)
            expect(interpretResult.paymentDetailInfo.totalPrice).to.be.eql(12600)
        })
    })
})
