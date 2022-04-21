import ApiBase from './api.config';
const ENVIRONMENT = process.env.NODE_ENV;
const ServerBase = ApiBase[ENVIRONMENT].protocol + "://" + ApiBase[ENVIRONMENT].host;
const ApiServer3 = {
  popup: ServerBase + '/common/v1/TAJA/popup/HOME?language=ko'
};

export default ApiServer3;
