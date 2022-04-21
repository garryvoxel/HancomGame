const mysql                             = require('./mysql');
const mysql_acc                         = require('./mysql');

const async                             = require('async');
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;

exports.search_rank_school = function(page,gamecode,callback){
    const typing_mysql = mysql.getWebRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_rank_school >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL,null);
        }else{

            //게임코드를 프론트에서 받아옵니다.
            let _gamecode = gamecode;

            //page 0은 현재 1이면 1주전 2면 2주전.
            var pastDate = parseInt(page);
            //테이블명 기본
            let tableName
   
            //요청당해년과월을 봅습니다.
            var date_1st = getDate(pastDate);
           
            //요청된 날이 몇번째 주인지 뽑습니다.
            var DateType_data = getWeek(pastDate);

            var str_date = date_1st.toString();
            var num =  parseInt(gamecode);
 
            switch(num)
            {
                case 10000://코인
                {
                    tableName = 'tbsetcoinranking_'+str_date+DateType_data;
                }break;
                case 10001://판뒤집기
                {
                    tableName = 'tbpanchangeranking_'+str_date+DateType_data;
                }break;
                case 10002://몰
                {
                    tableName = 'tbmoleranking_'+str_date+DateType_data;
                }break;
                case 10003://타이핑
                {
                    //실시간 랭킹 데이터가 남는 테이블명. + 남겨진 주간 
                    tableName = 'TbTypingPracticeRanking_'+str_date+DateType_data;
                }break;
               
            }


            let _query = "call web_select_rank_school_group(?,@_total_count);SELECT @_total_count as _total_count";
            con.query(_query,[tableName],(err1,rows,fields)=>{
                con.release();
                if(err1){
                    console.error('read_rank_school >> query error (mysql err)!!!'+err1);                 
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,null);
                    return;
                }else{                    
                    let _rdata ={};
                    let _data=[];
                    let _count=[];
                    let total_Count

                    _rdata.result = PACKET_ERR.SUCCESS;
                   
                    //전체카운트를 세봅니다.
                    var count = 0;

                    for(var j=0; j<rows[0].length; j++)
                    {
                        let rowdata = {};
                        rowdata.Score = rows[0][j].Score;
                        rowdata.SchoolName = rows[0][j].SchoolName;
                        rowdata.Rank = rows[0][j].Rank;

                        _data.push(rowdata);
                         count += 1;
                    }

                    if(rows.length == 0)
                    {
                        callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,null);
                        return;
                    }

                    let totalcount = {};
                    totalcount.totalcount = rows[2][0]._total_count;
                    _data.push(totalcount);
                     _rdata.data = _data;
 
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });

    
    

    

 
}//exports



 //들어온 날짜의 주간구하기
 function getWeek(num) {
  
    d = new Date();
    //데이트 피킹이 주간으로 넘어가기에 한번올때 카운트에 7일을 곱해서 날짜를 뒤로 뺀다.
    var trackingDay = num * 6;
    d.setDate(d.getDate()-trackingDay);

    var day = d.getDate();
    var st_Day = day.toString();

    var int_day = parseInt(st_Day);
 
    var str_result;
    if(int_day > 1 && int_day <= 6)
    {
        str_result = "04";
    }else if(int_day > 6 && int_day <= 12)
    {
        str_result = "01";
    }else if(int_day > 12 && int_day <= 19)
    {
        str_result = "02";
    }
    else if(int_day > 19 && (int_day <= 31))
    {
        str_result = "03";
    } 


    return str_result;
  };


function getDate(num){
    var today = new Date();

    //데이트 피킹이 주간으로 넘어가기에 한번올때 카운트에 7일을 곱해서 날짜를 뒤로 뺀다.
    var trackingDay = num * 7;
    today.setDate(today.getDate()-trackingDay);

    var mm = today.getMonth()+1;
    var mm2 = (mm>9 ? '': '0')+mm;
    var yyyy = today.getFullYear();

    var str_today = yyyy.toString()+mm2.toString();
    return str_today;
};

function getMonth(){
    var today = new Date();
  
    var mm = today.getMonth()+1;
    var mm2 = (mm>9 ? '': '0')+mm;
    var yyyy = today.getFullYear();

    var str_today = yyyy.toString()+mm2.toString();

    return str_today;
};

function getQueryForGame(gamecode){

    let _query
    var num = parseInt(gamecode);
    switch(num)
    {
        case 10000:
        {
            _query = "SELECT Win, Lose, Draw FROM TbSetCoin WHERE UUID=?";
        }break;
        case 10001:
        {
            _query = "SELECT Win, Lose, Draw FROM TbPanChange WHERE UUID=?";
          
        }break;
        case 10002:
        {
            _query = "SELECT MAX(Stage) AS stage, SUM(Score) AS score FROM TbMole WHERE UUID=?";
       
        }break;
        case 10003:
        {
            var month = getMonth();
            _query = "SELECT TotalSpeedCount FROM TbTwoTypingSpeed_"+month+" WHERE UUID=?";
        }break;
    }

    return _query;

  }