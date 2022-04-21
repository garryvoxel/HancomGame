const menu = {
    'typing-practice': {
        name: '한컴 타자연습',
        children: {
            'learning-key-placements': { name: '자리연습' },
            'exercising-words-typing': { name: '낱말연습' },
            'exercising-sentence-typing': { name: '짧은글연습' },
            'exercising-writing-typing': { name: '긴글연습' }
        }
    },
    games: {
        name: '게임',
        children: {
            'catching-moles': { name: '두더지잡기' },
            'piling-coins': { name: '동전쌓기' },
            'flipping-cards': { name: '판 뒤집기' }
        }
    },
    /*
    rankings: {
        name: '랭킹',
        children: {
            'typing': { name: '한컴 타자연습' },
            'catching-moles': { name: '두더지잡기' },
            'piling-coins': { name: '동전쌓기' },
            'flipping-cards': { name: '판 뒤집기' },
        }
    },
    */
    community: {
        name: '커뮤니티',
        children: {
            'clans': { name: '클랜' },
            'forum': { name: '자유게시판' },
            'friends': {
                name: '친구관리',
                children: {
                    'list': { name: '친구목록' },
                    'friend-requests-received': { name: '받은 친구 요청' },
                    'friend-request-sent': { name: '보낸 친구 요청' }
                }
            },
            'news': { name: '공지사항' },
            'events': { name: '이벤트' },
        }
    },
    support: {
        name: '고객센터',
        children: {
            'faq': { name: 'FAQ' },
            'inquiry': { name: '문의하기' }
        }
    },
    mypage: {
        name: '내타자정보',
        children: {
            'register-nickname': { name: '게임 닉네임 설정' },
            'basic-info': { name: '내 정보' },
            'points': { name: '포인트' },
            'stats': { name: '통계' }
        }
    },
    sample: {
        name: '샘플페이지',
    }
}

for (var parentKey in menu) {
    let parent = menu[parentKey]

    parent.uri = `/${parentKey}`

    if (parent.children) {
        for (var childKey in parent.children) {
            parent.children[childKey].uri = `/${parentKey}/${childKey}`
        }
    }
}

export default menu