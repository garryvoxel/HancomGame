const ENVIRONMENT = process.env.NODE_ENV || 'development';

let WebConfigTemp = {
	test: {
        environment: ENVIRONMENT,
        llnw: {
			loginURL: 'http://hancom-l.upload.llnw.net/account/login',  
			jsonRPC: 'http://hancom-l.upload.llnw.net/jsonrpc',  
			'X-Agile-Username': 'ml_admin',
			'X-Agile-Password': 'Hancom$#21',
			uploadURL: 'http://hancom-l.upload.llnw.net/post/raw',
			'X-Agile-Directory': '/typing',
			baseImageURL: 'https://cdn.malangmalang.com/typing',
			baseImageDomain: 'https://cdn.malangmalang.com',
			subDirForEvent: '/events'
		}
	},	
	development: {
        environment: ENVIRONMENT,
        llnw: {
			loginURL: 'http://hancom-l.upload.llnw.net/account/login',  
			jsonRPC: 'http://hancom-l.upload.llnw.net/jsonrpc',
			'X-Agile-Username': 'ml_admin',
			'X-Agile-Password': 'Hancom$#21',
			uploadURL: 'http://hancom-l.upload.llnw.net/post/raw',
			'X-Agile-Directory': '/typing',
			baseImageURL: 'https://cdn.malangmalang.com/typing',
			baseImageDomain: 'https://cdn.malangmalang.com',
			subDirForEvent: '/events'
		}
	},

	stage: {
        environment: ENVIRONMENT,
        llnw: {
			loginURL: 'http://hancom-l.upload.llnw.net/account/login',  
			jsonRPC: 'http://hancom-l.upload.llnw.net/jsonrpc',
			'X-Agile-Username': 'ml_admin',
			'X-Agile-Password': 'Hancom$#21',
			uploadURL: 'http://hancom-l.upload.llnw.net/post/raw',
			'X-Agile-Directory': '/typing',
			baseImageURL: 'https://cdn.malangmalang.com/typing',
			baseImageDomain: 'https://cdn.malangmalang.com',
			subDirForEvent: '/events'
		}
	},

	production: {
        environment: ENVIRONMENT,
        llnw: {
			loginURL: 'http://hancom-l.upload.llnw.net/account/login',  
			jsonRPC: 'http://hancom-l.upload.llnw.net/jsonrpc',
			'X-Agile-Username': 'ml_admin',
			'X-Agile-Password': 'Hancom$#21',
			uploadURL: 'http://hancom-l.upload.llnw.net/post/raw',
			'X-Agile-Directory': '/typing',
			baseImageURL: 'https://cdn.malangmalang.com/typing',
			baseImageDomain: 'https://cdn.malangmalang.com',
			subDirForEvent: '/events'
		}
	},

	live: {
        environment: ENVIRONMENT,
        llnw: {
			loginURL: 'http://hancom-l.upload.llnw.net/account/login',  
			jsonRPC: 'http://hancom-l.upload.llnw.net/jsonrpc',
			'X-Agile-Username': 'ml_admin',
			'X-Agile-Password': 'Hancom$#21',
			uploadURL: 'http://hancom-l.upload.llnw.net/post/raw',
			'X-Agile-Directory': '/typing',
			baseImageURL: 'https://cdn.malangmalang.com/typing',
			baseImageDomain: 'https://cdn.malangmalang.com',
			subDirForEvent: '/events'
		}
	}
}

const WebConfig = WebConfigTemp[ENVIRONMENT];

module.exports = WebConfig;