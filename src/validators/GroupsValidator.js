const { Validator } = require("node-input-validator");
const { validate, validations } = require("./index");

module.exports = () => {
  const validateAddGroup = async (req, res, next) => {
    const v = new Validator(req.body, {
      name: validations.general.requiredString,
    });

    validate(v, res, next, req);
  };

  const validateAddGroupMember = async (req, res, next) => {
    const v = new Validator(req.body, {
      memberId: validations.user.id,
    });

    validate(v, res, next, req);
  };

  const validateGroupMessage = async (req, res, next) => {
    const v = new Validator(req.body, {
      message: validations.general.requiredString,
    });

    validate(v, res, next, req);
  };

  return {
    validateAddGroup,
    validateAddGroupMember,
    validateGroupMessage,
  };
};
