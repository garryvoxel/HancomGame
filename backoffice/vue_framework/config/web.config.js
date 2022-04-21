const ENVIRONMENT = 'development'
//const ENVIRONMENT = 'production'
const WebConfig = {
	test: {
		environment: ENVIRONMENT,
		fontDomain: 'https://dev-typing.malangmalang.com'
	},	
	development: {
		environment: ENVIRONMENT,
		fontDomain: 'https://dev-typing.malangmalang.com'
	},

	production: {
		environment: ENVIRONMENT,
		fontDomain: 'https://stg-tt-mole-c.malangmalang.com'
	},

	live: {
		environment: ENVIRONMENT,
		fontDomain: 'https://tt-mole-c.malangmalang.com'
	}
}

export default WebConfig[ENVIRONMENT]