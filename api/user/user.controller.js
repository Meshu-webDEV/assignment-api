/**
 * @type {import('mongoose').Model}
 */
const User = require("./user.model");
const ERRORS = require("../../lib/errors");
const { hashPassword, checkPassword } = require("../../lib/utils");
const { jwtSign } = require("../../lib/jwt");

function signUp(data) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("signup started...");
      // check if exist
      const userExist = await User.findOne({ username: data.username });
      console.log("fetched database for existing user...");

      if (userExist) return reject(ERRORS.USER_ALREADY_EXIST);

      // hash password
      console.log("will hash password now...");
      const hashedPassword = await hashPassword(data.password);

      // save
      const user = await User.create({
        username: data.username,
        password: hashedPassword,
      });
      console.log("user saved in database...");

      // jwt sign
      const token = await jwtSign({ _id: user._id });
      console.log("token generated...");

      console.log({ ...user, token: token });
      console.log("resolving...");
      return resolve({ username: user.username, token: token });
    } catch (error) {
      console.log(error);
      reject(ERRORS.INTERNAL);
    }
  });
}

function signIn(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ username: data.username });

      // check if found
      if (!user) return reject(ERRORS.UNAUTHORIZED);

      // check password
      const isMatching = await checkPassword(data.password, user.password);

      if (!isMatching) return reject(ERRORS.INVALID_SIGNIN);

      // jwt sign
      const token = await jwtSign({ _id: user._id });

      return resolve({ username: user.username, token: token });
    } catch (error) {
      reject(ERRORS.INTERNAL);
    }
  });
}

function getUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      const results = User.find({ isDeleted: false }, { __v: 0, password: 0 });

      resolve(results);
    } catch (error) {
      reject(ERRORS.INTERNAL);
    }
  });
}

function getMe(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = User.findById(id, { __v: 0, password: 0 });

      resolve(user);
    } catch (error) {
      reject(ERRORS.UNAUTHORIZED);
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getMe,
};
