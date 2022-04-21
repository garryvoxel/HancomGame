const
    http = require('http'),
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    User = models.User

const SchoolController = {
    index(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[SchoolController.index()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const
            schoolType = req.query.school_type || 'elem_list',
            keyword = req.query.keyword,
            page = req.query.page || 1,
            count = req.query.count || 20

        if (!keyword) {
            return Controller.response(res, KEYWORD_IS_REQUIRED)
        }

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                http
                    .request({
                        host: 'www.career.go.kr',
                        path: `/cnet/openapi/getOpenApi?apiKey=e0fb145f78fa20055f2cf564121107cc&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${schoolType}&searchSchulNm=${encodeURIComponent(keyword)}&thisPage=${page}&perPage=${count}`,
                        //path: '/cnet/openapi/getOpenApi?apiKey=e0fb145f78fa20055f2cf564121107cc&svcType=api&svcCode=SCHOOL&contentType=json&gubun=elem_list&thisPage=1&perPage=20&searchSchulNm=%EC%84%9C%EC%9A%B8
                        method: 'GET',
                        headers: {
                            //'accept': 'application/json'  (이코드는 utf-8셋팅으로 보네질 않아서 간헐적 깨짐 현상이 있엇다. 2019.7.3)
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    }, reponse => {
                        let data = ''
                        reponse.setEncoding('utf8')
                        reponse.on('data', chunk => {
                            data += chunk
                        })

                        reponse.on('end', () => {
                            console.log(`[OpenApi] Response: ${data}`)
                        
                            const
                            //원래는 제이슨 파싱을 했으나 파싱과정중에서 한글이 깨짐현상이 간헐적 발생. 그냥 리스폰스하고 프론트에서 파싱하게 처리합니다. 2019.07.03
                                result = JSON.parse(data),
                                schools = result.dataSearch.content
                                //schools = data

                            Controller.response(res, {
                                ...Result.OK, 
                                totalCount: schools.length ? schools[0].totalCount : 0,
                                itemCount: schools.length,
                                items: schools
                            })
                        })
                    })
                    .on('error', error => {
                        console.error(`Error: ${error.message}`)
                    })
                    .end()
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = SchoolController