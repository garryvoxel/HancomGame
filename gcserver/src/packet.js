/**
 * 파일명: gcserver/src/packet.js
 * CPacket 클래스 정의
 * 말단과의 소켓처리를 진행하는 소켓 핸들러 처리부 정의
 */
const PACKET_DEF                        = require('./packet_def').PACKET_DEF;

const Login                             = require('./process/login').Login;
const Invite_Accept                     = require('./process/invite_accept').Invite_Accept;
const Invite_Reject                     = require('./process/invite_reject').Invite_Reject;
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;
const UserPool                          = require('./UserPool');

function CPacket(){        
}

/**
 * 말단과의 소켓처리 진행하는 메소드
 * 로그인 , 초대수락, 초대 거절등의 소켓 이벤트 처리를 정의한다.
 * @param {*소켓 핸들러} io 
 */
CPacket.prototype.process = function(io){

    io.sockets.on('connection',(socket)=>{
        console.log("connection : " + socket.id);
        //초대 수락
        socket.on(PACKET_DEF.REQ_INVITE_ACCEPT,(d)=>{  
            console.log('req_invite_accept : ' + d);  
            let _rdata = {};
            //초대수락소켓의 파라미터검사
            if(d.nick_name === undefined || d.nick_name === null ||
                d.session_id === undefined || d.session_id === null)
                {                    
                    _rdata.msg_idx = PACKET_DEF.RES_INVITE_ACCEPT;
                    _rdata.result = PACKET_ERR.PARAMETER_ERR;
                    socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_rdata);
                    return
                }

            var _sid = d.session_id;
            var _nn = d.nick_name;
            //세션체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){                
                    _rdata.msg_idx = PACKET_DEF.RES_INVITE_ACCEPT;
                    _rdata.result = PACKET_ERR.USER_SESSION_ERROR;
                    socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_rdata);    
                }else{        
                    //초대 수락            
                    this.req_invite_accept(socket,d);    
                }
            });                
            
            
        });
        
        //초대 거절
        socket.on(PACKET_DEF.REQ_INVITE_REJECT,(d)=>{
            console.log('req_invite_reject : ' + d);
            //초대거절소켓의 파라미터검사
            if(d.nick_name === undefined || d.nick_name === null || d.nick_name ===""||
                d.invite_nick_name === undefined || d.invite_nick_name === null ||d.invite_nick_name === ""||
                d.game_code === undefined || d.game_code === null||
                d.session_id === undefined || d.session_id === null||d.session_id === ""||
                d.invited_time === undefined || d.invited_time === null){
                    let _rdata = {};
                    _rdata.msg_idx = PACKET_DEF.RES_INVITE_REJECT;
                    _rdata.result = PACKET_ERR.PARAMETER_ERR;
                    socket.emit(PACKET_DEF.RES_INVITE_REJECT,_rdata);                    
                    return;
            }
            var _sid = d.session_id;
            var _nn = d.nick_name;
            //세션체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){                
                    _rdata.msg_idx = PACKET_DEF.RES_INVITE_REJECT;
                    _rdata.result = PACKET_ERR.USER_SESSION_ERROR;
                    socket.emit(PACKET_DEF.RES_INVITE_REJECT,_rdata);    
                }else{    
                    //초대 거절              
                    this.req_invite_reject(socket,d);    
                } 
            });
            
            
        });

        /**
         * 유저 로그인 
         * @param {*유저정보} d  
         */
        socket.on(PACKET_DEF.REQ_LOGIN,(d)=>{   
            console.log("SOCKET ON - " + PACKET_DEF.REQ_LOGIN + ' : '+JSON.stringify(d)); 
            let _rdata={};  
            //유저정보 파라미터 validation 체크
            if(d.nick_name === undefined || d.nick_name === null || d.nick_name ===""||
                d.session_id === undefined || d.session_id === null || d.session_id ==="")
            {                    
                    /**
                     * result - 파라미터 오류 
                     * msg_idx - res_login
                     * 말단 파라미터 오류 emit
                     */
                    _rdata.msg_idx = PACKET_DEF.RES_LOGIN;
                    _rdata.result = PACKET_ERR.PARAMETER_ERR;
                    socket.emit(PACKET_DEF.RES_LOGIN,_rdata);
                    return
            }      
            var _sid = d.session_id;
            var _nn = d.nick_name;     
            //세션체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){ 
                    //API서버에 등록된 세션아이디가 말단에서 전송된 세션아이디와 다른 경우               
                    _rdata.msg_idx = PACKET_DEF.RES_LOGIN;
                    _rdata.result = PACKET_ERR.USER_SESSION_ERROR;
                    socket.emit(PACKET_DEF.RES_LOGIN,_rdata);    
                }else{      
                    //세션아이디가 같은 경우
                    this.req_login(socket,d);  
                }
            });          
            
        });
        socket.on('disconnect',()=>{
            console.log('--disconnect--');
            //유저풀에서 반환함
            UserPool.withdraw(socket.id, (_n) => {
                if(_n != undefined && _n != null) {
                    if( process.env.NODE_ENV === "development"){
                        console.log('disconnect...'+_n);
                    }
                }
            });
        });
    });
}

//============================================================
CPacket.prototype.req_login = function(socket,d){
    let _nn = d.nick_name;
    let _sid = d.session_id;
    if(_nn === undefined || _nn === null ||
         _sid === undefined || _sid === null){
        //파라미터 오류... 소켓 해제
        console.log('req_loing parameter error..!!' + JSON.stringify(d));
        socket.disconnect(true);
        return;
    }
    
    Login(socket, _nn, _sid);
}
CPacket.prototype.req_invite_accept = function(socket,data){    
    let _rdata = {};
    _rdata.msg_idxc = PACKET_DEF.RES_INVITE_ACCEPT;
    _rdata.result = PACKET_ERR.SUCCESS;
    socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_rdata);
}

CPacket.prototype.req_invite_reject = function(socket,data){

    let _nn     = data.nick_name;
    let _inn    = data.invite_nick_name;
    let _it     = data.invited_time;
    let _gc     = data.game_code;
    console.log("req_invite_reject >> "+JSON.stringify(data));
    //초대 거절
    Invite_Reject(socket,_nn,_inn,_it,_gc,(err)=>{

        var _rdata={};
        _rdata.msg_idx = PACKET_DEF.RES_INVITE_REJECT;

        if(err == PACKET_ERR.NOT_USER){    
            //유저풀에 없을때    
          console.log('invite_reject disconnect....!!!');
          socket.disconnect(true);
          return;
        }else if(err === PACKET_ERR.TO_USER_LOG_OUT){
            //상대방이 로그 아웃   했을때
          _rdata.result = PACKET_ERR.TO_USER_LOG_OUT;
          socket.emit(PACKET_DEF.RES_INVITE_REJECT,_rdata);
          return;
        }else if(err===PACKET_ERR.INVITED_TIME_OVER){
            //초대거절유효시간이 지났을때
          return;
        }
        else{   
            //초대 거절 성공
            _rdata.result           = PACKET_ERR.SUCCESS;
            _rdata.msg_idx          = PACKET_DEF.RES_INVITE_REJECT;
            socket.emit(PACKET_DEF.RES_INVITE_REJECT,_rdata);

            //_data1.socket_id        = data.socket_id;
            //_data1.server_socket_id = data.server_socket_id;

            
        }         

    });

    

}

const get_session_id = require('./call_apiserver').get_session_id;
/**
 * 
 * @param {*세션 아이디} session_id 
 * @param {*닉네임} nick_name   
 * @param {*콜백} callback    
 */
function check_session_id(session_id,nick_name,callback){
    console.log("check_session_id - SESSION ID : "+session_id+", NICK : "+nick_name);
    //닉네임에 대응하는 세션아이디 얻기
    get_session_id(nick_name,(err,data)=>{
        if(err != PACKET_ERR.SUCCESS){
            //실패했을 때
            callback(false);
        }else{
            if(data.session_id !=session_id){
                //세션아이디가 다른 경우
                callback(false);
            }else{
                //세션 아이디가 같은 경우... 성공
                callback(true);
            }
        }
    });
}


//======================================================
// pub sub
const g_packet = new CPacket();

module.exports = g_packet;