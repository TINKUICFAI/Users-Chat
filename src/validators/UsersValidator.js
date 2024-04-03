const { Validator } = require("node-input-validator");
const { validate, validations } = require("./index");

module.exports = () => {
  const validateUserLogin = async (req, res, next) => {
    const v = new Validator(req.body, {
      username: validations.user.existsUsername,
      password: validations.general.requiredString,
    });

    validate(v, res, next, req);
  };

  const validateAddUser = async (req, res, next) => {
    const v = new Validator(req.body, {
      username: validations.user.username,
      password: validations.general.requiredString,
      fullName: validations.general.requiredString,
      isAdmin: validations.general.requiredBoolean,
    });

    validate(v, res, next, req);
  };

  const validateAddAdmin = async (req, res, next) => {
    const v = new Validator(req.body, {
      username: validations.general.requiredString,
      password: validations.general.requiredString,
      fullName: validations.general.requiredString,
      isAdmin: validations.general.requiredBoolean,
    });

    validate(v, res, next, req);
  };

  const validateUserId = async (req, res, next) => {
    let { username } = req.body;
    if (username) {
      await validateUserName(req, res, next);
    }
    const v = new Validator(req.params, {
      id: validations.user.id,
    });

    validate(v, res, next, req);
  };

  const validateUserName = async (req, res, next) => {
    const v = new Validator(req.body, {
      username: validations.user.username,
    });

    validate(v, res, next, req);
  };

  return {
    validateUserLogin,
    validateAddUser,
    validateAddAdmin,
    validateUserId,
    validateUserName,
  };
};
