var express = require('express');
var router = express.Router();
const PACKET_ERR                    = require('../src/packet_err').PACKET_ERR;
const read_point                    = require('../src/read_point').search_point;


router.post('/request_user_point', (req,res, next)=>{

    console.log("포인트 들어옴 ===="+req.body.sessionid);
    console.log("포인트 들어옴 ===="+req.body.start);
    console.log("포인트 들어옴 ===="+req.body.end);
    console.log("포인트 들어옴 ===="+req.body.page);
    console.log("포인트 들어옴 ===="+req.body.pagesize);
    let _session_id = req.body.sessionid;
    let start = req.body.start;
    let end =req.body.end;
    let page =req.body.page;
    let pagesize = req.body.pagesize;
    let _rdata={};
    read_point(_session_id,start,end,page,pagesize,(err, data)=>{

        console.log("들어옴");
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = 0;
            res.json(data);
            res.end();
        }

    });


});



module.exports = router;