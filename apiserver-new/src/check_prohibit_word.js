function check_words_token(words){
    
    let _len = words.length;
    let _data = [];
    switch(_len){
        case 1:{            
            return check_room_title_token_1(words);
        }
        case 2:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);            
            return _data;
        }
        case 3:{        
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            return _data;
        }
        case 4:{        
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            return _data;
        }
        case 5:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);  
            return _data;                                    
        }
        case 6:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            return _data;
        }
        case 7:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            return _data;
        }
        case 8:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            check_room_title_token_8(words,_data);  
            return _data;
        }
        case 9:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            check_room_title_token_8(words,_data);  
            check_room_title_token_9(words,_data);  
            return _data;            
        }
        case 10:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            check_room_title_token_8(words,_data);  
            check_room_title_token_9(words,_data);  
            check_room_title_token_10(words,_data);  
            return _data;            
        }
        case 11:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            check_room_title_token_8(words,_data);  
            check_room_title_token_9(words,_data);  
            check_room_title_token_10(words,_data);  
            check_room_title_token_11(words,_data);  
            return _data;            
        }
        case 12:{
            _data = check_room_title_token_1(words);
            check_room_title_token_2(words,_data);  
            check_room_title_token_3(words,_data);  
            check_room_title_token_4(words,_data);  
            check_room_title_token_5(words,_data);              
            check_room_title_token_6(words,_data);  
            check_room_title_token_7(words,_data);  
            check_room_title_token_8(words,_data);  
            check_room_title_token_9(words,_data);  
            check_room_title_token_10(words,_data);  
            check_room_title_token_11(words,_data);  
            check_room_title_token_12(words,_data);  
            return _data;            
        }
        
    }
}

function check_room_title_token_1(room_title){
    let _len = room_title.length;
    let _data=[];
    for(var i = 0; i < _len; i++){
        var _s = room_title.substr(i,1);
        _data.push(_s);
    }

    return _data;
}

function check_room_title_token_2(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=2){
        var _s = room_title.substr(i,2);
        if(_s.length == 2){
            data.push(_s);
        }
        
    }
    
}

function check_room_title_token_3(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=3){
        var _s = room_title.substr(i,3);
        if(_s.length == 3){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_4(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=4){
        var _s = room_title.substr(i,4);
        if(_s.length == 4){
            data.push(_s);
        }        
    }    
}

function check_room_title_token_5(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=5){
        var _s = room_title.substr(i,5);
        if(_s.length == 5){
            data.push(_s);
        }
        
    }    
}
function check_room_title_token_6(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=6){
        var _s = room_title.substr(i,6);
        if(_s.length == 6){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_7(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=7){
        var _s = room_title.substr(i,7);
        if(_s.length == 7){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_8(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=8){
        var _s = room_title.substr(i,8);
        if(_s.length == 8){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_9(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=9){
        var _s = room_title.substr(i,9);
        if(_s.length == 9){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_10(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=10){
        var _s = room_title.substr(i,10);
        if(_s.length == 10){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_11(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=11){
        var _s = room_title.substr(i,11);
        if(_s.length == 11){
            data.push(_s);
        }
        
    }    
}

function check_room_title_token_12(room_title,data){
    let _len = room_title.length;    
    for(var i = 0; i < _len; i+=12){
        var _s = room_title.substr(i,12);
        if(_s.length == 12){
            data.push(_s);
        }
        
    }    
}

module.exports = {
    check_words_token:check_words_token   
}