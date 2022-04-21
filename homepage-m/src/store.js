import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        last_Rank : 0,
        page : '',
        start_Rank : 0,
        first_user_Rank:0,
        max_Count:10,

        school_last_Rank : 0,
        school_page : '',
        school_start_Rank : 0,
        school_first_user_Rank:0,
        school_max_Count:10,
    },
    mutations:{
        user_Rank: function (state,payload){
            console.log(payload);
                state.last_Rank = payload;
            console.log(state.last_Rank);    
        },
        first_user_Rank :function(state,payload){
            state.first_user_Rank = payload;
        },
        page_direction : function(state,payload){
            console.log(payload)
            
            state.page = payload;
        },
        start_Rank: function(state,payload){
            console.log(payload);
            state.start_Rank = payload
        },

        school_user_Rank: function (state,payload){
            console.log(payload);
                state.school_last_Rank = payload;
            console.log(state.last_Rank);    
        },
        school_first_user_Rank :function(state,payload){
            state.school_first_user_Rank = payload;
        },
        school_page_direction : function(state,payload){
            console.log(payload)
            
            state.school_page = payload;
        },
        school_start_Rank: function(state,payload){
            console.log(payload);
            state.school_start_Rank = payload
        },
        

    }
})
export default store;