import PDFDocument from 'pdfkit'

export class PDFDocumentWithTables extends PDFDocument {
    constructor (options: any) {
        super(options)
    }

    table (table: any, arg0: any, arg1: any, arg2: any) {
        let startX = 40
        let startY = this.y
        let options: any = {}
        const menuFontSize = 50

        if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
            startX = arg0
            startY = arg1

            if (typeof arg2 === 'object') { options = arg2 }
        } else if (typeof arg0 === 'object') {
            options = arg0
        }

        const columnCount = table.headers.length
        const columnSpacing = options.columnSpacing || 15
        const rowSpacing = options.rowSpacing || 5
        const usableWidth = 600

        const prepareHeader = options.prepareHeader || (() => {})
        const prepareRow = options.prepareRow || (() => {})
        const computeRowHeight = (row: any) => {
            let result = 0

            row.forEach((cell: any) => {
                const cellHeight = this.heightOfString(cell, {
                    width: columnWidth,
                    align: 'left'
                })
                result = Math.max(result, cellHeight)
            })

            return result + rowSpacing
        }

        const columnWidth = 600
        const maxY = this.page.height - this.page.margins.bottom

        let rowBottomY = 0

        this.on('pageAdded', () => {
            startY = this.page.margins.top
            rowBottomY = 0
        })

        // Allow the user to override style for headers
        prepareHeader()

        // Check to have enough room for header and first rows
        if (startY + 3 * computeRowHeight(table.headers) > maxY) { this.addPage() }

        const menuWidth = 370
        const countWidth = 50
        const priceWidth = 180
        this.text('메뉴', 0, startY, {
            width: menuWidth,
            align: 'left'
        })
        this.text('수량', menuWidth, startY, {
            width: countWidth,
            align: 'right'
        })
        this.text('가격', menuWidth + countWidth, startY, {
            width: priceWidth,
            align: 'right'
        })

        // Refresh the y coordinate of the bottom of the headers row
        rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY)

        // Separation line between headers and rows
        this.moveTo(0, rowBottomY - rowSpacing * 0.5)
            .lineTo(usableWidth, rowBottomY - rowSpacing * 0.5)
            .lineWidth(2)
            .stroke()

        this.fontSize(menuFontSize)
        table.rows.forEach((row: any, i: any) => {
            const rowHeight = computeRowHeight(row)
            // Switch to next page if we cannot go any further because the space is over.
            // For safety, consider 3 rows margin instead of just one
            if (startY + 3 * rowHeight < maxY) {
                startY = rowBottomY + rowSpacing
            } else {
                this.addPage()
            }

            // Allow the user to override style for rows
            prepareRow(row, i)

            if (i === table.rows.length - 1) {
                this.moveTo(0, rowBottomY - rowSpacing * 0.5)
                    .lineTo(usableWidth, rowBottomY - rowSpacing * 0.5)
                    .lineWidth(2)
                    .stroke()
            }

            const menuName = row[0]
            const count = row[1]
            const price = row[2]
            this.fontSize(menuFontSize).text(menuName, 0, startY, {
                align: 'left'
            })
            const yPosition = this.x > menuWidth ? startY + rowHeight : startY
            this.text(count, menuWidth, yPosition, {
                width: countWidth,
                align: 'right'
            })
            this.text(price, menuWidth + countWidth, yPosition, {
                width: priceWidth,
                align: 'right'
            })

            // Refresh the y coordinate of the bottom of this row
            rowBottomY = Math.max(yPosition + rowHeight, rowBottomY)
        })

        this.x = startX
        this.moveDown()

        return this
    }
}
