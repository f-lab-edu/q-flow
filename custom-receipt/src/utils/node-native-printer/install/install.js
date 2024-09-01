const win = require('./install_win.ts')
const unix = require('./install_unix.js')

const platform = process.platform

process.on('exit', code => {
    if (code === 1) {
        console.log('Installation aborted.\n\n')
    }
})

if (platform === 'win32') {
    win()
} else {
    unix()
}
