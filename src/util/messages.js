module.exports = (lang = "en") => {
  const user_already_found = {
    en: "User already found with given username, Try again after new username!",
  };

  const success = {
    en: "success",
  };

  const logout = {
    en: "logout successfully",
  };

  const invalid_token = {
    en: "invalid token",
  };

  const users_list = {
    en: "users list",
  };

  const user_not_found = {
    en: "user detail not found with given id",
  };

  const group_not_found = {
    en: "group detail not found with given id",
  };

  const forbidden = {
    en: "forbidden",
  };

  const user_exist_in_group = {
    en: "member already exists in this group",
  };

  return {
    user_already_found: user_already_found[lang],
    success: success[lang],
    logout: logout[lang],
    invalid_token: invalid_token[lang],
    users_list: users_list[lang],
    user_not_found: user_not_found[lang],
    group_not_found: group_not_found[lang],
    forbidden: forbidden[lang],
    user_exist_in_group: user_exist_in_group[lang],
  };
};
