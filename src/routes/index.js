const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/admin", require("./admin"));
router.use("/groups", require("./groups"));

module.exports = router;
