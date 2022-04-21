const AuthController = {
    getSessionId(request) {
        let sessionId = getSessionIdFromHeader(request)

        if (! sessionId) {
            sessionId = getSessionIdFromBody(request)
        }

        return sessionId

        function getSessionIdFromBody(request) {
            return request.body.session_id || null
        }

        function getSessionIdFromHeader(request) {
            const authorization = request.headers['Authorization'] || request.headers['authorization']

            if (! authorization) {
                return null
            }

            const sessionId = authorization.split(' ')[1]

            console.log(`[AuthController.getSessionId()] Session Id: ${sessionId}`)

            if (! sessionId) {
                return null
            }

            return sessionId
        }
    }
}

module.exports = AuthController