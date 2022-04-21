let array_data = null;

exports.start = function(done) {
    array_data = new Array;
}

// 백오피스에서 디비에 비속어를 추가 하기때문에 따로 셋팅 기능을 둡니다.

exports.set = function(arr) {
    array_data =  arr.slice(0, arr.length);
}

exports.check = function(sentence) {
    var resultMsg = {
        isFound: false,
        word: ""
    }
    console.log("비속어 어레이 카운트 ========="+array_data.length);

    for(var n=0;n<array_data.length;n++){
        if ((sentence && sentence.indexOf(array_data[n])!=-1)) {
            resultMsg.word=array_data[n];
            resultMsg.isFound=true;
            return resultMsg;
        }//if
     }//for
    return resultMsg;
}

exports.length = function(done) {
    
   return array_data.length;
}

exports.instance = function() {
    return array_data;
}