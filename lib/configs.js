module.exports = {
  WEB_SERVER: {
    PORT: process.env.PORT || 6060,
    ENV: process.env.NODE_ENV || "development",
    ORIGIN:
      process.env.NODE_ENV === "production"
        ? process.env.API_ORIGIN
        : "http://localhost:6060",
  },
  CLIENT: {
    URL_ORIGIN:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_DOMAIN
        : "http://localhost:3000",
  },
  META: {
    API_VERSION: process.env.API_VERSION,
  },
  DATABASE: {
    URI: process.env.MONGO_URI,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
};
