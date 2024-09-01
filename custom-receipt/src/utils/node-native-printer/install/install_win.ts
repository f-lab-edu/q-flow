import fs from 'fs'
import dotenv from 'dotenv'

export default function () {
    const flags: any = []

    if (flags.includes('-p') || flags.includes('--production')) {
        // eslint-disable-next-line n/no-path-concat
        dotenv.config({ path: fs.realpathSync(__dirname + '/../.env') })
        if (process.env.NNP_PACKAGE) {
            return
        } else {
            console.error('It has been used flag -p but no package has been specified during dev installation.\nAborting.')
            process.exit(1)
        }
    }

    const pattern = new RegExp('.*edge.*', 'gi')
    let choices

    try {
        // eslint-disable-next-line n/no-path-concat
        choices = fs.readdirSync(__dirname + '/../../')
    } catch (error) {}

    if (choices) {
        choices = choices.filter(value => {
            return pattern.test(value)
        })

        choices.push('Not listed')

        makeEnv('edge-js')
    } else {
        manuallyInsert()
    }
}

function makeEnv (pack: any) {
    fs.writeFileSync(fs.realpathSync(__dirname + '\\..') + '\\.env', `NNP_PACKAGE=${pack}`)
}

function manuallyInsert () {
    makeEnv('edge-js')
}
