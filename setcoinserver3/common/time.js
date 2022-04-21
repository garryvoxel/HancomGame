class CTime{
    //현재 시간 구하는 함수
    static getTime(){
        var _now = new Date();
        //var _t = _now.getTime() / 1000;
        var _t = _now.getTime();
        return _t;
    }
    //현재 날짜 및 시간 구하는 함수
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
    //1~100까지 랜덤 숫자 구하는 함수
    static getRandom(){
        return Math.floor(Math.random() * (100 - 0)) + 0;
    }
}


module.exports = CTime;