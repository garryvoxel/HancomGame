class UserUtils { 

    extractUserid(anArray, keyName){

        if(typeof(anArray) === 'undefined') { 
            console.log('----- anArray for extract UserIds is undefined'); 
            return [];  
        }  
        let ids=[];
        if (!anArray.length) return [];
        else {
            for(let i in anArray){
                ids.push(anArray[i][keyName])
            }
            //유저목록 중복 ID 제거
            ids = Array.from(new Set(ids));
            console.log('UserUtils ids ::: %j', ids);
            return ids;
        }
    }

    mapperIDnNick(userList, idColumnName, nickname ){
        let id_n_nick_mapper={};

        for(i in userList){
            id_n_nick_mapper[UserList[i][idColumnName]] = UserList[i][nickname];
        }
        console.log('UserUtils id_n_nick_mapper ::: %j', id_n_nick_mapper);
        return id_n_nick_mapper;
    }
}

module.exports = UserUtils;