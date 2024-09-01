import { SerialPort } from 'serialport'
import iconv from 'iconv-lite'
import { Printer } from './printer'
import { InterpreterFactory } from './interpreter/interpreter-factory'

const port = new SerialPort({
    path: 'COM30',
    baudRate: 9600,
    autoOpen: true
})
const printer = new Printer()
const interpreterFactory = new InterpreterFactory()

port.on('open', (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('open')
    }
    port.on('data', function (data) {
        const decodedData = iconv.decode(data, 'EUC-KR').toString()
        if (decodedData.length < 20) {
            return
        }
        const interpreter = interpreterFactory.getInterpreter(decodedData)
        printer.print(interpreter.interpret(decodedData))
    })
})
