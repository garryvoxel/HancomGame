const menu = {
    'service': {
        name: '서비스관리',
        css: 'ti-dashboard',
        children: {
            'news': { name: '공지사항' },
            'event': { name: '이벤트' },
            'ranking': { name: '랭킹' },
            'clan': { name: '클랜' },
            'forum': { name: '자유게시판' },
            'forum-report-post': { name: '자게신고글-원글' },
            'forum-report-comment': { name: '자게신고글-댓글' },
            'faq': { name: 'FAQ' }
        }
    },
    content: {
        name: '콘텐츠관리',
        css: 'ti-layout-sidebar-left',
        children: {
            'typing': { name: '타자연습' },
            'catching-moles': { name: '두더지게임' },
            'piling-coins': { name: '동전쌓기' },
            'flipping-cards': { name: '판뒤집기' },
        }
    },
    ad: {
        name: '광고관리',
        css: 'ti-pie-chart',
        children: {
            'ad-management': { name: '광고관리' },
        }
    },
    member: {
        name: '회원관리',
        css: 'ti-palette',
        children: {
            'member-management': { name: '회원관리' },
        }
    },
    point: {
        name: '포인트',
        css: 'ti-slice',
        children: {
            'point-management': { name: '포인트' },
        }
    },
    managers: {
        name: '관리자관리',
        css: 'ti-layers-alt',
        children: {
            'list': { name: '관리자관리' },
        }
    },
    monitoring: {
        name: '모니터링',
        css: 'fa fa-exclamation-triangle',
        children: {
            'slang': { name: '비속어목록' },
        }
    },
    statistics: {
        name: '통계',
        css: 'fa fa-align-left',
        children: {
            'stat-login': { name: '로그인통계' },
            'stat-bymember': { name: '회원통계' },
            'stat-bymenu': { name: '메뉴별통계' },
            'dau-mau': { name: 'DAU/MAU' },
            'stat-withdrawal': { name: '탈퇴자현황' },
            'stat-session': { name: '세션' },
            'stat-retain-login': { name: '로그인리텐션' },
            'stat-run-bygame': { name: '게임별실행수' },
            'stat-fin-bygame': { name: '게임별완료수' },
            'stat-daumau-bygame': { name: '게임별DAU/MAU' },
            'stat-retain-bygame': { name: '게임별리텐션' },
            'stat-learning-key-placements': { name: '자리연습통계' },
            'stat-exercising-words-typing': { name: '낱말연습통계' },
            'stat-exercising-sentence-typing': { name: '짧은글연습통계' },
            'stat-exercising-writing-typing': { name: '긴글연습통계' }
        }
    }
}

for (var parentKey in menu) {
    let parent = menu[parentKey]

    parent.uri = `/${parentKey}`

    if (parent.children) {
        for (var childKey in parent.children) {
            switch(childKey) {
                case 'clan' :
                case 'ranking':
                case 'typing': 
                case 'catching-moles': 
                case 'piling-coins': 
                case 'flipping-cards': 
                //case 'point-management':
                case 'stat-login':
                case 'stat-bymember':
                case 'stat-bymenu':
                case 'dau-mau':
                case 'stat-withdrawal':
                case 'stat-session':
                case 'stat-retain-login':
                case 'stat-run-bygame':
                case 'stat-fin-bygame':
                case 'stat-daumau-bygame':
                case 'stat-retain-bygame':
                case 'stat-learning-key-placements':
                case 'stat-exercising-words-typing':
                case 'stat-exercising-sentence-typing':
                case 'stat-exercising-writing-typing':             
                    parent.children[childKey].uri = `javascript:alert('준비중입니다.')`;
                    break;
                default:
                    parent.children[childKey].uri = `/${parentKey}/${childKey}`;
            }
            
        }
    }
}

export default menu