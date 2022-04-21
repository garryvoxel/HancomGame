const
    http = require('http'),
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    User = models.User,
    School = models.School,
    UserSchool = models.UserSchool

const RankingController = {
    index(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[RankingController.personal()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const
            startDate = req.query.start_date
            page = req.query.page || 1,
            count = req.query.count || 10

        let
            myRanking,
            theUser,
            theRankings,
            totalCount = 0,
            typingPracticeRankingTable

        if (! startDate) {
            const thisSunday = new Date()

            thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay())

            const
                year = thisSunday.getFullYear(),
                month = thisSunday.getMonth() + 1 < 10 ? `0${thisSunday.getMonth() + 1}` : thisSunday.getMonth() + 1,
                day = '02'//thisSunday.getDate() < 10 ? `0${thisSunday.getDate()}` : thisSunday.getDate(),
                
            typingPracticeRankingTable = `TbTypingPracticeRanking_${year}${month}${day}`
        } else {
            typingPracticeRankingTable = `TbTypingPracticeRanking_${startDate}`
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

                theUser = user

                return Promise.all([
                    models.sequelizes.WebDB.query(`SELECT UUID AS user_id, NickName AS nickname, Rank AS ranking, Score AS score FROM ${typingPracticeRankingTable} WHERE UUID = :user_id`, {
                        replacements: {
                            user_id: user.id
                        },
                        type: models.Sequelize.QueryTypes.SELECT
                    }),
                    UserSchool.findOne({
                        where: {
                            user_id: user.id
                        },
                        include: [
                            { model: School, as: 'school' }
                        ]
                    })
                ])
            })
            .spread((rankings, userSchool) => {
                if (!rankings.length) {
                    myRanking = {
                        user_id: theUser.id,
                        nickname: theUser.nickname,
                        ranking: null,
                        score: 0
                    }
                } else {
                    myRanking = rankings[0]
                }

                myRanking.user = Controller.getPrivateUser(theUser)
                myRanking.school = userSchool && userSchool.school ? userSchool.school.toJSON() : null
                myRanking.year = userSchool ? userSchool.year : null
                myRanking.classroom = userSchool ? userSchool.classroom : null

                return Promise.all([
                    models.sequelizes.WebDB.query(`SELECT COUNT(*) AS count FROM ${typingPracticeRankingTable}`, {
                        type: models.Sequelize.QueryTypes.SELECT
                    }),
                    models.sequelizes.WebDB.query(`SELECT UUID AS user_id, NickName AS nickname, (Rank + 1) AS ranking, Score AS score FROM ${typingPracticeRankingTable} ORDER BY Rank ASC LIMIT ${(page - 1) * count}, ${count}`, {
                        type: models.Sequelize.QueryTypes.SELECT
                    })
                ])
            })
            .spread((rows, rankings) => {
                totalCount = rows[0].count

                theRankings = rankings

                const promises = rankings.map(ranking => {
                    return UserSchool.findOne({
                        where: {
                            user_id: ranking.user_id
                        },
                        include: [
                            { model: School, as: 'school' }
                        ]
                    })
                })

                return Promise.all(promises)
            })
            .then(responses => {
                responses.forEach((userSchool, i) => {
                    theRankings[i].school = userSchool && userSchool.school ? userSchool.school.toJSON() : null
                    theRankings[i].year = userSchool ? userSchool.year : null
                    theRankings[i].classroom = userSchool ? userSchool.classroom : null
                })

                Controller.response(res, {
                    ...Result.OK,
                    myRanking: myRanking,
                    totalCount: totalCount,
                    itemCount: theRankings.length,
                    items: theRankings
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = RankingController