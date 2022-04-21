class CTime{
    static getTime(){
        var _now = new Date();
        //var _t = _now.getTime() / 1000;
        var _t = _now.getTime();
        return _t;
    }

    static getYMD(t){
        var _now = new Date(t);

        let yyyy = '' + _now.getFullYear();

        // month
        let mm = ('0' + (_now.getMonth() + 1));  // prepend 0 // +1 is because Jan is 0
        mm = mm.substr(mm.length - 2);                  // take last 2 chars

        // day
        let dd = ('0' + _now.getDate());         // prepend 0
        dd = dd.substr(dd.length - 2);           // take last 2 chars

        let h = _now.getHours();

        let m = _now.getMinutes();

        let s = _now.getSeconds();

        let _f = yyyy+"-"+mm+"-"+dd+" "+h+":"+m+":"+s;

        return _f;
    }

    static getNowYMD(){
        var _now = new Date();
        var _fd = _now.toISOString().split('T')[0]+' '+_now.toTimeString().split(' ')[0];
        return _fd;        
    }

    /**
     * 0 ~ 99사이의 랜덤값 가져옴
     */
    static getRandom(){
        return Math.floor(Math.random() * (100 - 0)) + 0;
    }

    static getMonth(){
        var d = new Date();
        var month = d.getMonth() + 1;
        return month < 10 ? '0' + month : '' + month; // ('' + month) for string result 
    }

    static getYear(){
        var d = new Date();
        return d.getFullYear();        
    }

    static getDate(){
        var d = new Date();
        return d.getDate();

    }
}


module.exports = CTime;