class CServerInfo{
    constructor(){
        this.private_ip = '';
        this.public_ip  = '';
        this.port       = 0;
    }
    //사설IP 설정 함수
    setPrivateip(ip){
        this.ip = ip;
    }
    //사설IP 가져오는 함수
    getPrivateip(){
        return this.ip;
    }
    //공인IP 설정 함수
    setPublicIP(ip){        
        this.public_ip = ip;
    }
    //공인IP 가져오는 함수
    getPublicIP(){
        return this.public_ip;
    }
    //포트 설정 함수
    setPort(p){
        this.port = p;
    }
    //포트 가져오는 함수
    getPort(){
        return this.port;
    }


}

let g_si = new CServerInfo();
module.exports = g_si;