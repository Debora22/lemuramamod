module.exports = {
  publicPath: 'public',
  behindBalancer: true,
  port: process.env.PORT,
  supportCors: false,
  debugRequest: false,
  services: {
    authServer : {
      url : process.env.AUTHNZ_API_URL,
      authenticationScope: 'modsquad'
    },
    photorankAPI: {
      url : process.env.PHOTORANK_API_URL,
    },
    adminAPI: {
      url: process.env.ADMIN_API_URL,
    },
    adminAPI2: {
      url: process.env.ADMIN_API_V2_URL,
    },
    photorank: {
      url: process.env.PHOTORANK_URL,
    },
    anafrus: {
      url: process.env.ANAFRUS_API_URL,
      enabled: true,
      bulkLimit: 10
    },
    google: {
      translate: {
        url: 'https://www.googleapis.com',
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      }
    },
    submission:{
      url: process.env.REPORTING_API_URL,
    },
    redis: {
      cacheStorage: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        db: Number(process.env.REDIS_DB_FOR_STORAGE),
      },
      sessionStorage: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        db: Number(process.env.REDIS_DB_FOR_SESSION),
      }
    }
  }
};
