const
    express = require('express'),
    router = express.Router(),
    path = require('path');


function vue_client(req, res) { 
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../public/typing', 'vue_client.html'))
}

/* express_vue_bridge router */

/* for pages */
router.get('/', function (req,res){vue_client(req,res);});
router.get('/login', function (req,res){vue_client(req,res);});
router.get('/typing/login', function (req,res){vue_client(req,res);});

router.get('/typing/managers', function (req,res){vue_client(req,res);});
router.get('/typing/managers/list', function (req,res){vue_client(req,res);});
router.get('/typing/managers/form', function (req,res){vue_client(req,res);});
router.get('/typing/managers/:id/edit', function (req,res){vue_client(req,res);});
router.get('/typing/managers/pwmodifyforce', function (req,res){vue_client(req,res);});

router.get('/typing/service/forum', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/forum-report-post', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum-report-post/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum-report-post/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/forum-report-comment', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum-report-comment/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/forum-report-comment/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/accusation', function (req,res){vue_client(req,res);});
router.get('/typing/service/accusation/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/accusation/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/news', function (req,res){vue_client(req,res);});
router.get('/typing/service/news/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/news/write', function (req,res){vue_client(req,res);});
router.get('/typing/service/news/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/faq', function (req,res){vue_client(req,res);});
router.get('/typing/service/faq/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/faq/write', function (req,res){vue_client(req,res);});
router.get('/typing/service/faq/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/event', function (req,res){vue_client(req,res);});
router.get('/typing/service/event/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/event/write', function (req,res){vue_client(req,res);});
router.get('/typing/service/event/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/service/ranking', function (req,res){vue_client(req,res);});
router.get('/typing/service/ranking/list', function (req,res){vue_client(req,res);});

router.get('/typing/service/clan', function (req,res){vue_client(req,res);});
router.get('/typing/service/clan/list', function (req,res){vue_client(req,res);});
router.get('/typing/service/clan/:id/detail', function (req,res){vue_client(req,res);});
router.get('/typing/service/clan/:id/forumdetail', function (req,res){vue_client(req,res);});

router.get('/typing/content/typing', function (req,res){vue_client(req,res);});
router.get('/typing/content/typing/index', function (req,res){vue_client(req,res);});
router.get('/typing/content/typing/article_csvupload', function (req,res){vue_client(req,res);});

router.get('/typing/content/catching-moles', function (req,res){vue_client(req,res);});
router.get('/content/catching-moles/index', function (req,res){vue_client(req,res);});

router.get('/typing/ad/ad-management', function (req,res){vue_client(req,res);});
router.get('/typing/ad/ad-management/list', function (req,res){vue_client(req,res);});
router.get('/typing/ad/ad-management/write', function (req,res){vue_client(req,res);});
router.get('/typing/ad/ad-management/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/point/point-management', function (req,res){vue_client(req,res);});
router.get('/typing/point/point-management/list', function (req,res){vue_client(req,res);});
router.get('/typing/point/point-management/givepoint', function (req,res){vue_client(req,res);});

router.get('/typing/member/member-management', function (req,res){vue_client(req,res);});
router.get('/typing/member/member-management/list', function (req,res){vue_client(req,res);});
router.get('/typing/member/member-management/:id/detail', function (req,res){vue_client(req,res);});

router.get('/typing/monitoring/slang', function (req,res){vue_client(req,res);});
router.get('/typing/monitoring/slang/list', function (req,res){vue_client(req,res);});
router.get('/typing/monitoring/slang/write', function (req,res){vue_client(req,res);});
router.get('/typing/monitoring/slang/csvupload', function (req,res){vue_client(req,res);});

router.get('/typing/statistics/stat-login', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-bymember', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-bymenu', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/dau-mau', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-withdrawal', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-retain-login', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-run-bygame', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-fin-bygame', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-daumau-bygame', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-retain-bygame', function (req,res){vue_client(req,res);});

router.get('/typing/statistics/stat-learning-key-placements', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-exercising-words-typing', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-exercising-sentence-typing', function (req,res){vue_client(req,res);});
router.get('/typing/statistics/stat-exercising-writing-typing', function (req,res){vue_client(req,res);});

module.exports = router;
