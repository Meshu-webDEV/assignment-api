const Joi = require("joi");
const ERRORS = require("../errors");

/**
 * Validation function.
 *
 * @param {Object} data - Data object to be validated
 * @param {Joi.Schema} schema - Schema object to be validated against
 * @return {promise<any>} A resolved/rejected promise based on validation
 */
function validate(data, schema) {
  return new Promise(async (resolve, reject) => {
    try {
      await schema.validateAsync(data);
      resolve();
    } catch (error) {
      reject({ ...ERRORS.MALFORMED_INFO, errors: error.message });
    }
  });
}

module.exports = validate;
