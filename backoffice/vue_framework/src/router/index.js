import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import ResponseCode from "@/utils/response_code";

// for page
import login from '@/pages/login'
import managers from '@/pages/managers'
import service_forum from '@/pages/service_forum'
import service_forum_report_post from '@/pages/service_forum_report_post'
import service_forum_report_comment from '@/pages/service_forum_report_comment'
import service_forum_accusation from '@/pages/service_forum_accusation'
import service_news from '@/pages/service_news'
import service_event from '@/pages/service_event'
import service_ranking from '@/pages/service_ranking'
import service_clan from '@/pages/service_clan'
import content_typing from '@/pages/content_typing'
import content_catchingmoles from '@/pages/content_catchingmoles'
import ad from '@/pages/ad.vue'
import point from '@/pages/point.vue'
import member from '@/pages/member.vue'
import monitoring_slang from '@/pages/monitoring_slang'
import service_faq from '@/pages/service_faq'
import statistics_stat_login from '@/pages/statistics_stat_bylogin'
import statistics_stat_bymember from '@/pages/statistics_stat_bymember'
import statistics_stat_bymenu from '@/pages/statistics_stat_bymenu'
import statistics_stat_daumau from '@/pages/statistics_stat_daumau'
import statistics_stat_withdrawal from '@/pages/statistics_stat_withdrawal'
import statistics_stat_retain_login from '@/pages/statistics_stat_retain_login'
import statistics_stat_run_bygame from '@/pages/statistics_stat_run_bygame'
import statistics_stat_fin_bygame from '@/pages/statistics_stat_fin_bygame'
import statistics_stat_daumau_bygame from '@/pages/statistics_stat_daumau_bygame'
import statistics_stat_retain_bygame from '@/pages/statistics_stat_retain_bygame'

import statistics_stat_learning_key_placements from '@/pages/statistics_stat_learning_key_placements'
import statistics_stat_exercising_words_typing from '@/pages/statistics_stat_exercising_words_typing'
import statistics_stat_exercising_sentence_typing from '@/pages/statistics_stat_exercising_sentence_typing'
import statistics_stat_exercising_writing_typing from '@/pages/statistics_stat_exercising_writing_typing'



Vue.use(Router)

function authenticate(to, from, next) {
	if (!Vue.cookie.get('loginuser')) {
    window.location.href = '/typing/login'
		return;
  } else {
    require('es6-promise').polyfill();
    axios
    .get('/typing/api/session_check')
    .then(response=>{
      if (typeof response == "undefined") {
        return;
      } else {
          switch (response.data.code) {
              case ResponseCode.OK.code:
                  next();
                  break;
              case ResponseCode.UNAUTHORIZED.code:
              default:
                Vue.cookie.delete("loginuser");
                Vue.cookie.delete("display_name");              
                window.location.href = '/typing/login'
          } //switch
      } //if else
    });      
  }
}

export default new Router({
  mode: 'history',
  routes: [
     { path: '/', redirect: '/typing/login' }
    ,{ path: '/login', redirect: '/typing/login' }
    ,{ path: '/typing', redirect: '/typing/login' }
    ,{ path: '/typing/login', name: 'login', component: login }

    ,{ path: '/typing/managers', redirect: '/typing/managers/list' }
    ,{ path: '/typing/managers/list', name: 'managerlist', component: managers, beforeEnter: authenticate }
    ,{ path: '/typing/managers/form', name: 'managerform', component: managers, beforeEnter: authenticate }
    ,{ path: '/typing/managers/:id/edit', name: 'manageredit', component: managers, beforeEnter: authenticate }
    ,{ path: '/typing/managers/pwmodifyforce', name: 'managerpwupdate', component: managers, beforeEnter: authenticate }

    ,{ path: '/typing/service/forum', redirect: '/typing/service/forum/list' }
    ,{ path: '/typing/service/forum/list', name: 'serviceforumlist', component: service_forum }
    ,{ path: '/typing/service/forum/:id/detail', name: 'serviceforumdetail', component: service_forum }

    ,{ path: '/typing/service/forum-report-post', redirect: '/typing/service/forum-report-post/list' }
    ,{ path: '/typing/service/forum-report-post/list', name: 'serviceforumreportlistpost', component: service_forum_report_post }
    ,{ path: '/typing/service/forum-report-post/:id/detail', name: 'serviceforumreportpostdetail', component: service_forum_report_post }

    ,{ path: '/typing/service/forum-report-comment', redirect: '/typing/service/forum-report-comment/list' }
    ,{ path: '/typing/service/forum-report-comment/list', name: 'serviceforumreportcommentlist', component: service_forum_report_comment }
    ,{ path: '/typing/service/forum-report-comment/:id/detail', name: 'serviceforumreportcommentdetail', component: service_forum_report_comment }

    ,{ path: '/typing/service/accusation', redirect: '/typing/service/accusation/list' }
    ,{ path: '/typing/service/accusation/list', name: 'accusationlist', component: service_forum_accusation }
    ,{ path: '/typing/service/accusation/:id/detail', name: 'accusationdetail', component: service_forum_accusation }

    ,{ path: '/typing/service/news', redirect: '/typing/service/news/list' }
    ,{ path: '/typing/service/news/list', name: 'servicenewslist', component: service_news, beforeEnter: authenticate }
    ,{ path: '/typing/service/news/write', name: 'servicenewswrite', component: service_news, beforeEnter: authenticate }
    ,{ path: '/typing/service/news/:id/detail', name: 'servicenewsdetail', component: service_news, beforeEnter: authenticate }    

    ,{ path: '/typing/service/faq', redirect: '/typing/service/faq/list' }
    ,{ path: '/typing/service/faq/list', name: 'servicefaqlist', component: service_faq, beforeEnter: authenticate }
    ,{ path: '/typing/service/faq/write', name: 'servicefaqwrite', component: service_faq, beforeEnter: authenticate }
    ,{ path: '/typing/service/faq/:id/detail', name: 'servicefaqdetail', component: service_faq, beforeEnter: authenticate }  

    ,{ path: '/typing/service/event', redirect: '/typing/service/event/list' }
    ,{ path: '/typing/service/event/list', name: 'serviceeventlist', component: service_event }
    ,{ path: '/typing/service/event/write', name: 'serviceeventwrite', component: service_event }
    ,{ path: '/typing/service/event/:id/detail', name: 'serviceeventdetail', component: service_event }       

    ,{ path: '/typing/service/ranking', redirect: '/typing/service/ranking/list' }
    ,{ path: '/typing/service/ranking/list', name: 'servicerankinglist', component: service_ranking }

    ,{ path: '/typing/service/clan', redirect: '/typing/service/clan/list' }
    ,{ path: '/typing/service/clan/list', name: 'serviceclanlist', component: service_clan }    
    ,{ path: '/typing/service/clan/:id/detail', name: 'serviceclandetail', component: service_clan }    
    ,{ path: '/typing/service/clan/:id/forumdetail', name: 'serviceclanforumdetail', component: service_clan }    

    ,{ path: '/typing/content/typing', redirect: '/typing/content/typing/index' }
    ,{ path: '/typing/content/typing/index', name: 'contenttypingindex', component: content_typing }    
    ,{ path: '/typing/content/typing/article_csvupload', name: 'contenttypingarticlecsvupload', component: content_typing }    

    ,{ path: '/typing/content/catching-moles', redirect: '/typing/content/catching-moles/index' }
    ,{ path: '/typing/content/catching-moles/index', name: 'contentcatchingmolesindex', component: content_catchingmoles }   

    ,{ path: '/typing/ad/ad-management', redirect: '/typing/ad/ad-management/list' }
    ,{ path: '/typing/ad/ad-management/list', name: 'adlist', component: ad }   
    ,{ path: '/typing/ad/ad-management/write', name: 'adwrite', component: ad }   
    ,{ path: '/typing/ad/ad-management/:id/detail', name: 'addetail', component: ad }   

    ,{ path: '/typing/point/point-management', redirect: '/typing/point/point-management/list' }
    ,{ path: '/typing/point/point-management/list', name: 'pointlist', component: point }   
    ,{ path: '/typing/point/point-management/givepoint', name: 'pointgiveform', component: point }   

    ,{ path: '/typing/member/member-management', redirect: '/typing/member/member-management/list' }
    ,{ path: '/typing/member/member-management/list', name: 'memberlist', component: member }     
    ,{ path: '/typing/member/member-management/:id/detail', name: 'memberdetail', component: member }     

    ,{ path: '/typing/monitoring/slang', redirect: '/typing/monitoring/slang/list' }
    ,{ path: '/typing/monitoring/slang/list', name: 'monitoringslanglist', component: monitoring_slang }     
    ,{ path: '/typing/monitoring/slang/write', name: 'monitoringslangwrite', component: monitoring_slang }    
    ,{ path: '/typing/monitoring/slang/csvupload', name: 'monitoringslangcvsupload', component: monitoring_slang }    

    ,{ path: '/typing/statistics/stat-login', name: 'statisticsstatlogin', component: statistics_stat_login }    
    ,{ path: '/typing/statistics/stat-bymember', name: 'statisticsstatbymember', component: statistics_stat_bymember }    
    ,{ path: '/typing/statistics/stat-bymenu', name: 'statisticsstatmenu', component: statistics_stat_bymenu }    
    ,{ path: '/typing/statistics/dau-mau', name: 'statisticsstatdaumau', component: statistics_stat_daumau }    
    ,{ path: '/typing/statistics/stat-withdrawal', name: 'statisticsstatwithdrawal', component: statistics_stat_withdrawal }        
    ,{ path: '/typing/statistics/stat-retain-login', name: 'statisticsstatretainlogin', component: statistics_stat_retain_login }    
    ,{ path: '/typing/statistics/stat-run-bygame', name: 'statisticsstatrunbygame', component: statistics_stat_run_bygame }    
    ,{ path: '/typing/statistics/stat-fin-bygame', name: 'statisticsstatfinbygame', component: statistics_stat_fin_bygame }    
    ,{ path: '/typing/statistics/stat-daumau-bygame', name: 'statisticsstatdaumaubygame', component: statistics_stat_daumau_bygame }    
    ,{ path: '/typing/statistics/stat-retain-bygame', name: 'statisticsstatretainbygame', component: statistics_stat_retain_bygame }   

    ,{ path: '/typing/statistics/stat-learning-key-placements', name: 'statisticsstatlearningkeyplacements', component: statistics_stat_learning_key_placements }    
    ,{ path: '/typing/statistics/stat-exercising-words-typing', name: 'statisticsstatexercisingwordstyping', component: statistics_stat_exercising_words_typing }    
    ,{ path: '/typing/statistics/stat-exercising-sentence-typing', name: 'statisticsstatexercisingsentencetyping', component: statistics_stat_exercising_sentence_typing }    
    ,{ path: '/typing/statistics/stat-exercising-writing-typing', name: 'statisticsstatexercisingwritingtyping', component: statistics_stat_exercising_writing_typing }    
  ]
})
