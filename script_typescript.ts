import { SocketClientTCP } from 'netlinkwrapper'

const host: string = '192.168.1.89'
const port: number = 13001
const password: string = 'SHOWMETHEMONEY'
const cmd: string = 'USER_COUNT'

/*
cmd variable can be:
IS_SERVER_UP - returns string (YES or NO)
USER_COUNT - returns string (total, empire1, empire2, empire3, local)
DC <playerName> - returns string (Player kicked out)
BLOCK_CHAT <playerName> - returns string (BLOCK_CHAT <playerName> or BLOCK_CHAT FAIL)
NOTICE <message> - returns UNKNOWN
SHUTDOWN - returns UNKNOWN
PRIV_EMPIRE <privEmpire> <empire> <type> <value> <duration> - returns string (PRIV_EMPIRE SUCCEED or PRIV_EMPIRE FAIL)
RELOAD - reloads protos - returns UNKNOWN
RELOAD <option> -
    u - reloads state user count - returns UNKNOWN
    p - reloads protos - returns UNKNOWN
    s - reloads database strings - returns UNKNOWN
    f - reloads fishing - returns UNKNOWN
    a - reloads admins - returns UNKNOWN
 */

const client = new SocketClientTCP(port, host)

let received: Buffer | String | undefined

client.send(`\x40${password}\n`)
client.receive()

client.send(`\x40${cmd}\n`)
received = client.receive()

if (received) {
    received = received.toString().replace(/\r?\n|\r/, '')

    if (!isNaN(Number(received.charAt(0)))) {
        const userCount = received.split(/[ ]+/)
        console.log(`Total[${userCount[0]}] ${userCount[1]} / ${userCount[2]} / ${userCount[3]} (this server ${userCount[4]})`)
    } else if (received === 'UNKNOWN') {
        console.log('Command sent and executed with no custom response')
    } else {
        console.log(received)
    }
} else {
    console.log('An error occurred.')
}

client.disconnect()
