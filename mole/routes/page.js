var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/',function(req,res,next){
 
    res.render('./typing/WebContent/index.html');    
    res.end();

});

router.post('/',function(req,res,next){
 
    //res.render('client.html');
    //res.send("connect...");
    res.end();

});

module.exports = router;