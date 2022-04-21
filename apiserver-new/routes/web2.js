var express                     = require('express');
var router                      = express.Router();
const PACKET_ERR                = require('../src/packet_err').PACKET_ERR;

const write_friend_complete = require('../src/write_web2').write_friend_complete;
router.post('/friend/accept_friend_request',(req,res,next)=>{
    console.log(JSON.stringify(req.body));
 let _sid               = req.body.session_id;
 let _friend_nick_name  = req.body.friend_nick_name;

 write_friend_complete(_sid,_friend_nick_name,(err)=>{
     let _rdata={};
     _rdata.result = err;
     res.send(_rdata);
     res.end();
 });
});


const load_word =  require('../src/write_web2').loadWord;
router.post('/load_word_request',(req,res,next)=>{

    console.log("로드 합니다 비속어");
    load_word((err)=>{
        let _rdata={};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});



module.exports = router;