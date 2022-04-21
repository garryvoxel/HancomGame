function isEmpty(param) {
    if (param === "" || param === null || param === undefined 
    || (param !== null && typeof param === "object" && !Object.keys(param).length))
        return true
    else
        return false
}

//룸번호 생성
function generateRoomNumber(length = 5) {
    var result = '';
    var characters       = '0123456789';   
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
}

module.exports = {
    isEmpty, 
    generateRoomNumber
}