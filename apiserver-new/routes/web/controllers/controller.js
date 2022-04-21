const
    Result = require('../classes/result.class'),
    models = require('../../../models')

const Controller = {
    getPublicUser(user) {
        if (!user || typeof user !== 'object') {
            return
        }

        return Controller.filter(user, [
            'id',
            'nickname',
            'avatar',
            'schoold_id',
            'language',
            'timezone',
            'secession',
            'created_at'
        ])
    },

    getPrivateUser(user) {
        if (!user || typeof user !== 'object') {
            return
        }

        return Controller.filter(user, [
            'nickname',
            'avatar',
            'school',
            'target_typing_speed',
            'target_typing_accuracy',
            'language',
            'timezone'
        ])
    },

    getPublicClan(clan) {
        if (!clan || typeof clan !== 'object') {
            return
        }

        return Controller.filter(clan, [
            'name',
            'description',
            'created_at',
            'manager',
            'creator'
        ])
    },

    getPublicPostClan(post){
        if (!post || typeof post !== 'object') {
            return
        }

        return Controller.filter(post, [
            'id',
            'clan_id',
            'subject',
            'content',
            'author_id',
            'views',
            'likes',
            'order',
            'created_at',
            'comments_count',
            'deleted_at'
        ])
    },
    getPublicNews(post) {
        if (!post || typeof post !== 'object') {
            return
        }

        return Controller.filter(post, [
            'id',
            'subject',
            'content',
            'author_id',
            'views',
            'likes',
            'order',
            'is_private',
            'created_at',
            'comments_count',
            'deleted_at'
        ])
    },

    getPublicPost(post) {
        if (!post || typeof post !== 'object') {
            return
        }

        return Controller.filter(post, [
            'id',
            'subject',
            'content',
            'author_id',
            'views',
            'likes',
            'order',
            'created_at',
            'comments_count',
            'deleted_at'
        ])
    },

    getPublicFaq(faq) {
        if (!faq || typeof faq !== 'object') {
            return
        }

        return Controller.filter(faq, [
            'id',
            'category',
            'question',
            'answer'
        ])
    },

    getPublicAd(ad) {
        if (!ad || typeof ad !== 'object') {
            return
        }

        return Controller.filter(ad, [
            'platform',
            'type',
            'image_url',
            'target_uri'
        ])
    },
    
    account_regit_log(uuid, nickname, school_id) {
        if(uuid){
            models.sequelizes.LogDB
            .query('CALL InsertAccountRegitLog(:_uuid,:_nickname,:_school_id)', 
            {
                replacements: {_uuid : uuid,
                               _nickname : nickname,
                               _school_id : school_id,
                              }
            })
            .then(()=>{ 
                console.log('AccRegitLog Ok: ', nickname)
                return;
            })
            .catch(error => {
                console.log('AccRegitLog Insert Error: ', error)
               
                return;
            })
        }else{
            console.log('account_regit_log: there is not uuid')
            return;
        }
    },

    update_account_school_info(uuid,school_id, school_name){
        console.log("학교이림 ------------------------------"+school_name);
        console.log("학교 아이디 ------------------------------"+school_id);


        models.sequelizes.AccountDB
        .query('CALL WEB_update_school_info(:UUID, :SC_ID, :SC_NAME)',{
            replacements:{
                UUID : uuid,
                SC_ID : school_id,
                SC_NAME : school_name

            }
        })
        .catch(error =>{
            console.log('update_account_school_info  Error: ', error)
                return
        })
        return

    },

    update_school_id_regit_log(uuid,school_id){
       
            models.sequelizes.LogDB
            .query('CALL Update_School_Id_Regit(:_uuid, :_school_id)',{
                replacements:{
                    _uuid : uuid,
                    _school_id : school_id
                }
            })
            .catch(error => {
                console.log('update_school_id_regit_log  Error: ', error)
                return
            })
            return
      
    },

    update_avatar_clanmem(uuid, avatar){

        models.sequelizes.WebDB
        .query('CALL web_update_avatar_clanmem(:_member_id, :_avatar)',{
            replacements:{
                _member_id : uuid,
                _avatar : avatar
            }
        })
        .catch(error => {
            console.log('update_avatar_clanmem  Error: ', error)
            return
        })
    },

    response(res, json, log) {
        if (log) {
            if (json && json.code) {
                log.Msg19 = json.message
            }
        
            let os;
            let browser;

            switch(log.Msg1){
                case 'Chrome':
                    {
                        os = 1;
                        browser = 1;
                    }
                    break;
                case 'Chrome Mobile':
                    {
                        os = 2;
                        browser = 1;
                    }
                    break;
                case 'IE':
                    {
                        os = 1;
                        browser = 2;
                    }
                    break;
                case 'IE Mobile':
                    {
                        os = 2;
                        browser = 2;
                    }
                    break;
                case 'Android':
                    {
                        os = 2;
                        browser = 0;
                    }
                    break;
                case 'IOS':
                    {
                        os = 3;
                        browser = 0;
                    }
                    break;
                case 'Safari':
                    {
                        os = 1;
                        browser = 5;
                    }
                    break;
                case 'Safari Mobile':
                    {
                        os = 3;
                        browser = 5;
                    }
                    break;
                case 'Firefox':
                    {
                        os = 1;
                        browser = 3;
                    }
                    break;
                default:
                    {
                        os = 0;
                        browser = 0;
                    }
            }
         
            models.sequelizes.LogDB
            .query('CALL InsertLoginLog(:_uuid,:_nickname,:_school_id,:_os,:_browser,:_account_regit_date)', 
            {
                replacements: {_uuid : json.user.id ,
                               _nickname : json.user.nickname,
                               _school_id : json.user.schoold_id,
                               _os : os,
                               _browser : browser,
                               _account_regit_date : json.user.created_at}
            })
            .then(()=>{ 
                console.log('LogLog: ', json)
                return res.json(json)
            })
            .catch(error => {
                console.log('LogLog Insert Error: ', error)
                console.log('Response: ', json)
                return res.json(json)
            })
            
        } else {
            console.log('Response: ', json)
            return res.json(json)
        }
    },

    filter(source, fields) {
        if (!fields || !Array.isArray(fields)) {
            return
        }

        let result = {}

        fields.forEach(field => {
            if (source[field] !== undefined) {
                result[field] = source[field]
            }
        })

        return result
    },

    isRestricted(src, code) {
        if ((src == null) || (src == "") || (code == null)) {
            return false;
        }
        code = parseInt(code);
        if ((code == NaN) || (code < Result.NOT_ALLOWED_TO_WRITE.code)) {
            return false;
        }
        var restrictedIndx = code - Result.NOT_ALLOWED_TO_WRITE.code;
        if ((restrictedIndx < 0) || (src.length <= restrictedIndx)) {
            return false;
        }
        if (src.charAt(restrictedIndx) == '0') {
            return false;
        }

        return true;
    }
}

module.exports = Controller