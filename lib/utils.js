const bcrypt = require("bcrypt");
const { nanoid, customAlphabet } = require("nanoid");
const ERRORS = require("./errors");

/**
 *
 * @param {Number} size
 * @default 21
 * @returns {Promise<String>} a uniqueid
 */
function createUniqueId(size = 21) {
  return new Promise(async (resolve, reject) => {
    try {
      const uniqueId = await nanoid(size);
      resolve(uniqueId);
    } catch (error) {
      reject(ERRORS.INTERNAL);
    }
  });
}

/**
 *
 * @param {Number} size
 * @param {String} custom Custom alphabet
 * @default 21
 * @returns {Promise<String>} a uniqueid
 */
function createUniqueCustomId(size = 4, custom = "1234567890") {
  return new Promise(async (resolve, reject) => {
    try {
      const alphabeticalId = await customAlphabet(custom, size)();
      resolve(alphabeticalId);
    } catch (error) {
      reject(ERRORS.INTERNAL);
    }
  });
}

/**
 *
 * @param {Number} size
 * @default 21
 * @returns {Promise<String>} a uniqueid
 */
function createUniquePassword(size = 21) {
  return new Promise(async (resolve, reject) => {
    try {
      const alphabeticalPassword = await customAlphabet(
        "1234567890abcdefghiklmnopqrstvxyz",
        size
      )();
      const specialCharacters = await customAlphabet("!@#$%^&*", 2)();
      resolve(`${alphabeticalPassword}${specialCharacters}`);
    } catch (error) {
      reject(ERRORS.INTERNAL);
    }
  });
}

function hashPassword(password) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return resolve(hashedPassword);
    } catch (error) {
      return reject(ERRORS.INTERNAL);
    }
  });
}

function checkPassword(password, hashedPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const isMatching = await bcrypt.compare(password, hashedPassword);

      return resolve(isMatching);
    } catch (error) {
      return reject(ERRORS.INTERNAL);
    }
  });
}

function normalize(string = "") {
  return string.toString().replace(/ /g, "").toLowerCase();
}

module.exports = {
  hashPassword,
  checkPassword,
  createUniqueId,
  createUniqueCustomId,
  createUniquePassword,
  normalize,
};
