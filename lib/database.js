const mongoose = require("mongoose");

const { DATABASE } = require("./configs");

function connect() {
  return new Promise(async (resolve, reject) => {
    try {
      const { connection } = await mongoose.connect(DATABASE.URI, {
        keepAlive: true,
        keepAliveInitialDelay: 8000,
      });
      resolve(connection);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = connect;
