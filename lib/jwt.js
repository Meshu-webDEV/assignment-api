const jwt = require("jsonwebtoken");
const ERRORS = require("./errors");
const { JWT } = require("./configs");

function jwtSign(payload, options = { expiresIn: "2weeks" }) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT.SECRET, options, (err, token) => {
      if (err) return reject(ERRORS.INTERNAL);

      return resolve(token);
    });
  });
}

function jwtVerify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT.SECRET, (err, decoded) => {
      if (err) reject(ERRORS.INTERNAL);

      return resolve(decoded);
    });
  });
}

/**
 *
 * @param {string} token Authorization token
 * @returns Decoded token payload
 */
function jwtTokenPayload(token) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = await jwtVerify(token);

      return resolve(payload);
    } catch (error) {
      return reject(new Error(errorMessages.INTERNAL));
    }
  });
}

module.exports = { jwtSign, jwtVerify, jwtTokenPayload };
