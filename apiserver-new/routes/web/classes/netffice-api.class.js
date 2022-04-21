const
    https = require('https'),
    Result = require('./result.class')

class NetfficeApi {
    constructor(sessionId, settings) {
        this.host = settings.host
        this.basePath = settings.basePath
        this.sessionId = sessionId
    }

    options(opts) {
        const options = {
            host: this.host,
            path: this.basePath,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-zeropc-mapi-sid': this.sessionId
            }
        }

        for (let key in opts || {}) {
            options[key] = opts[key]
        }

        return options
    }

    getUserInfoUri(onSuccess, onError) {
        const options = this.options({
            path: this.basePath + '/getUserInfo'
        })

        console.log(`[NetfficeApi] Request: ${JSON.stringify(options)}`)

        https.request(options, res => {
            let data = ''

            res.on('data', chunk => {
                data += chunk
            })

            res.on('end', () => {
                console.log(`[NetfficeApi] Response: ${data}`)

                if (onSuccess) {
                    onSuccess(res, JSON.parse(data))
                }
            })
        })
            .on('error', error => {
                console.error(`Error: ${error.message}`)

                if (onError) {
                    onError(error)
                }
            })
            .end()
    }

    validateResponse(response, data) {
        if (data === undefined || data === null || data === '') {
            return Result.NETFFICE_NO_DATA
        }

        if (!data.code || data.code.substr(0, 2) !== '01') {
            return Result.NETFFICE_ERROR
        }

        return Result.OK
    }
}

module.exports = NetfficeApi