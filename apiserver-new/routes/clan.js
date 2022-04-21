var express = require('express');
var router = express.Router();
const PACKET_ERR                       = require('../src/packet_err').PACKET_ERR;
const write_regit_clan                 = require('../src/write_regit_clan').regit_clan;

router.post('/request_regit_clan',(req, res, next)=>{


    let _session_id = req.body.sessionid;
    let _clan_name = req.body.clanname;
    let _clan_desc = req.body.desc;
    let _rdata={};

    write_regit_clan(_session_id,_clan_name,_clan_desc,(err, data)=>{
        if (err === PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS) {
            _rdata = { result: err, word : data.word };
        }
        else if(err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata = { result: err};
        }else{
            _rdata.result = 0;
        }
        res.send(_rdata);
        res.end();
    });

});

const write_join_clan           = require('../src/write_join_clan').join_clan
router.post('/request_join_clan',(req, res, next)=>{


    let _session_id = req.body.sessionid;
    let _clanid = req.body.clanid;
    let _rdata={};

    write_join_clan(_session_id,_clanid,(err, data)=>{


        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = 0;
            res.json(_rdata);
            res.end();
        }
    });

});

const write_accept_clanmember           = require('../src/write_accept_clan_member').accept_clan_member
router.post('/request_accept_clanmember',(req, res, next)=>{

    let _session_id = req.body.sessionid;
    let _userid = req.body.userid;//가입해온 유저
    let _clanid = req.body.clanid;
    let _rdata={};

    write_accept_clanmember(_session_id,_clanid,_userid,(err, data)=>{


        if (err === PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS) {
            _rdata = { result: err, word : data.word };
        }else if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
        }else{
            _rdata.result = 0;
        }
        res.send(_rdata);
        res.end();
    });

});

const write_dell_clanmember           = require('../src/write_accept_clan_member').dell_clan_member
router.post('/request_dell_clanmember',(req, res, next)=>{


    let _session_id = req.body.sessionid;
    let _userid = req.body.userid;
    let _clanid = req.body.clanid;
    let _rdata={};

    write_dell_clanmember(_session_id,_clanid,_userid,(err, data)=>{


        if(err != PACKET_ERR.SUCCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = 0;
            res.json(_rdata);
            res.end();
        }
    });

});

const write_dell_clan_wanab_member           = require('../src/write_accept_clan_member').dell_clan_wanab_member
router.post('/request_dell_clan_wanab_member',(req, res, next)=>{

    let _session_id = req.body.sessionid;
    let _userid = req.body.userid;
    let _clanid = req.body.clanid;
    let _rdata={};

    write_dell_clan_wanab_member(_session_id,_clanid,_userid,(err, data)=>{

   
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = 0;
            res.json(_rdata);
            res.end();
        }
    });

});

const write_dell_clan          = require('../src/write_accept_clan_member').dell_clan
router.post('/request_dell_clan',(req, res, next)=>{

    let _session_id = req.body.sessionid;
    let _clanid = req.body.clanid;
    let _rdata={};

    write_dell_clan(_session_id,_clanid,(err, data)=>{

        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = 0;
            res.json(_rdata);
            res.end();
        }
    });

});

const search_all_caln           = require('../src/read_claninfo').search_all_caln
router.post('/request_all_clan_info',(req,res, next)=>{


    let _page = req.body.page;
    let _pagesize = req.body.pagesize;
    let _rdata={};

    search_all_caln(_page,_pagesize,(err, data)=>{

  
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            data.result = 0;
            res.json(data);
            res.end();
        }
    });

});

const search_my_caln           = require('../src/read_claninfo').get_my_clan
router.post('/request_my_clan_info',(req,res, next)=>{

 
    let _session_id = req.body.sessionid;
    let _rdata={};

    search_my_caln(_session_id,(err, data)=>{

    
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            data.result = 0;
            res.json(data);
            res.end();
        }
    });

});


const search_my_caln_wanab           = require('../src/read_claninfo').get_my_clan_wanab_member
router.post('/request_my_clan_wanab_info',(req,res, next)=>{


    let _session_id = req.body.sessionid;
    let _rdata={};

    search_my_caln_wanab(_session_id,(err, data)=>{

  
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
    
            data.result = 0;
            res.json(data);
            res.end();
        }
    });

});

const search_chosed_claninfo           = require('../src/read_claninfo').search_chosed_caln
router.post('/request_chosed_clan_info',(req,res, next)=>{

   // console.log("클랜전체 보여줘");
    let _id = req.body.id;
    let _rdata={};

    search_chosed_claninfo(_id,(err, data)=>{

    //    console.log("들어옴");
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            data.result = 0;
            res.json(data);
            res.end();
        }
    });

});

const exchange_master_clan           = require('../src/write_accept_clan_member').exchange_master
router.post('/request_exchange_master_clan',(req,res, next)=>{


    let _session_id = req.body.sessionid;
    let _to_id = req.body.to_id;
    let _to_nick = req.body.to_nick;
    let _clan_id = req.body.clan_id;
    let _rdata={};

    exchange_master_clan(_session_id,_to_id,_to_nick ,_clan_id ,(err, data)=>{

    
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            _rdata.result = err;
            res.json(_rdata);
            res.end();
        }
    });

});

const update_clan_desc          = require('../src/write_accept_clan_member').update_clan_desc
router.post('/request_update_clan_desc',(req, res, next)=>{

    let _session_id = req.body.sessionid;
    let _clanid = req.body.clanid;
    let _desc = req.body.desc;
    let _rdata={};

    update_clan_desc(_session_id,_clanid,_desc,(err, data)=>{

        if (err === PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS) {
            _rdata = { result: err, word : data.word };
        }
        else if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
        }else{
            _rdata.result = 0;
        }
        res.send(_rdata);
        res.end();
    });

});


const search_my_caln_all           = require('../src/read_claninfo').get_my_clan_all
router.post('/request_my_clan_info_all',(req,res, next)=>{

 
    let _session_id = req.body.sessionid;
    let _rdata={};

    search_my_caln_all(_session_id,(err, data)=>{

    
        if(err != PACKET_ERR.WRITE_CLAN_DATA_SUCESS){
            _rdata.result = err;
            res.send(_rdata);
            res.end();        
        }else{
            data.result = 0;
            res.json(data);
            res.end();
        }
    });

});


module.exports = router;