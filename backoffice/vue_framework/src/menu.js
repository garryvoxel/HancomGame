const menu = {
    'service': {
        name: '서비스관리',
        permission: 1,
        css: 'ti-dashboard',
        children: {
            'news': { name: '공지사항' },
            'event': { name: '이벤트' },
            'ranking': { name: '랭킹' },
            'clan': { name: '클랜' },
            'forum': { name: '자유게시판' },
            'accusation': { name: '자게신고글 관리' },
            'faq': { name: 'FAQ' }
        }
    },
    content: {
        name: '콘텐츠관리',
        permission: 2,
        css: 'ti-layout-sidebar-left',
        children: {
            'typing': { name: '타자연습' }
        }
    },
    ad: {
        name: '광고관리',
        permission: 3,
        css: 'ti-pie-chart',
        children: {
            'ad-management': { name: '광고관리' },
        }
    },
    member: {
        name: '회원관리',
        permission: 4,
        css: 'ti-palette',
        children: {
            'member-management': { name: '회원관리' },
        }
    },
    point: {
        name: '포인트',
        permission: 5,
        css: 'ti-slice',
        children: {
            'point-management': { name: '포인트' },
        }
    },
    managers: {
        name: '관리자관리',
        permission: 6,
        css: 'ti-layers-alt',
        children: {
            'list': { name: '관리자관리' },
        }
    },
    monitoring: {
        name: '모니터링',
        permission: 7,
        css: 'fa fa-exclamation-triangle',
        children: {
            'slang': { name: '비속어목록' },
        }
    },
    statistics: {
        name: '통계',
        permission: 8,
        css: 'fa fa-align-left',
        children: {
            'stat-login': { name: '로그인통계' },
            'stat-bymember': { name: '회원통계' },
            'stat-bymenu': { name: '메뉴별통계' },
            'dau-mau': { name: 'DAU/MAU' },
            'stat-withdrawal': { name: '탈퇴자현황' },
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

    var permissions = fv.Cookie.getCookie('permissions');
    //alert(permissions);

for (var parentKey in menu) {
    let parent = menu[parentKey]

    parent.uri = `/${parentKey}`

    let permissionStatus = permissions.substr((parent.permission -1) ,1);
    //alert(permissionStatus);

    if (parent.children) {
        for (var childKey in parent.children) {
            if(permissionStatus > 0) parent.children[childKey].uri = `/typing/${parentKey}/${childKey}`;
            else  parent.children[childKey].uri = `javascript:alert('해당 페이지에 접근 권한이 없습니다')`;
        }
    }
}

export default menu