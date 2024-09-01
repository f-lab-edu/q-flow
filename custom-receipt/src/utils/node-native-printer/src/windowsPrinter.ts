import fs from 'fs'
import os from 'os'

import edge from 'edge-js'

// eslint-disable-next-line n/no-path-concat
const dllPath = fs.realpathSync(process.cwd() + '/src/utils/node-native-printer/lib/windows/windows_printer.dll').replace('.asar', '.asar.unpacked')

export class WinPrinter {
    printer: string

    constructor () {
        this.printer = ''
    }

    listPrinters () {
        const list = edge.func({
            assemblyFile: dllPath,
            typeName: 'windows_printer.API',
            methodName: 'ListPrinters' // This must be Func<object,Task<object>>
        })

        return new Promise((resolve, reject) => {
            list('', function (error: Error, response: any) {
                if (error) { reject(error) } else { resolve(response) }
            })
        })
    }

    defaultPrinterName () {
        const defaultName = edge.func({
            assemblyFile: dllPath,
            typeName: 'windows_printer.API',
            methodName: 'DefaultPrinterName' // This must be Func<object,Task<object>>
        })

        return new Promise((resolve, reject) => {
            defaultName('', function (error: Error, response: any) {
                if (error) { reject(error) } else { resolve(response) }
            })
        })
    }

    setPrinter (printer: string) {
        this.printer = printer
    }

    getCurrentPrinter () {
        return this.printer
    }

    printerInfo (printer = '') {
        const infos = edge.func({
            assemblyFile: dllPath,
            typeName: 'windows_printer.API',
            methodName: 'PrinterInfo' // This must be Func<object,Task<object>>
        })

        return new Promise((resolve, reject) => {
            infos(printer || this.printer, function (error: Error, response: any) {
                if (error) { reject(error) } else { resolve(response) }
            })
        })
    }

    /**
     * Get options of supplied printer of, if not supplied, of printer set with `setPrinter()`.
     * If no printer is set or supplied, it will be take the default printer.
     * @param {string?} printer
     * @returns {Promise<{
     *     Collate?: string[],
     *     Duplexing?: string[],
     *     MaxCopy?: number,
     *     SupportsColor?: boolean,
     *     PaperSheets?: string[],
     *     Resolutions?: string[]
     * }>}
     */
    printerOptions (printer = '') {
        const getOptions = edge.func({
            assemblyFile: dllPath,
            typeName: 'windows_printer.API',
            methodName: 'GetOptions' // This must be Func<object,Task<object>>
        })

        return new Promise((resolve, reject) => {
            getOptions(printer || this.printer, function (error: Error, response: any) {
                if (error) { reject(error) } else { resolve(response) }
            })
        })
    }

    /**
     * Print a file.
     * @param {string} filename
     * @param {{
     *     collate?: boolean,
     *     duplex?: string,
     *     fromPage?: number,
     *     toPage?: number
     *     color?: boolean,
     *     landscape?: boolean,
     *     paperSize?: string,
     *     copies?: number
     * }} userOptions
     * @param {string?} printer
     * @returns {Promise<boolean>}
     */
    print (filename: string | null = null, userOptions: any = {}, printer = '') {
        if (!printer) {
            if (this.printer) { printer = this.printer } else { console.warn('No printer specified. Will be used default printer') }
        }

        const defaultOptions: any = {
            collate: true,
            duplex: 'Default',
            fromPage: 0,
            toPage: 0,
            color: true,
            landscape: false,
            paperSize: '',
            printerName: printer,
            copies: 1,
            filePath: filename
        }

        const options: any = {}
        Object.keys(defaultOptions).forEach(value => {
            if (userOptions[value] != null || userOptions[value] !== undefined) { options[value] = userOptions[value] } else { options[value] = defaultOptions[value] }
        })

        const printFile = edge.func({
            assemblyFile: dllPath,
            typeName: 'windows_printer.API',
            methodName: 'Print' // This must be Func<object,Task<object>>
        })

        if (!filename) {
            throw new Error('File path not specified')
        }

        return new Promise((resolve, reject) => {
            printFile(options, function (error: Error, response: any) {
                if (error) { reject(error) } else { resolve(response) }
            })
        })
    }

    /**
     * Print a string directly.
     * @param {string} text
     * @param {{
     *     collate?: boolean,
     *     duplex?: string,
     *     fromPage?: number,
     *     toPage?: number
     *     color?: boolean,
     *     landscape?: boolean,
     *     paperSize?: string,
     *     copies?: number
     * }} options
     * @param {string?} printer
     */
    printText (text = '', options = {}, printer = '') {
        const filepath = os.tmpdir() + '/nnp_tmp.txt'

        fs.writeFileSync(filepath, text)

        this.print(filepath, options, printer)
    }
}
