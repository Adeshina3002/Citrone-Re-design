const express = require("express")
const router = express.Router();
const { isTokenValid } = require("../utils/jwt");
const {
  getAllModules,
  getModule,
  createModule,
  updateModule
} = require("../controllers/moduleController");

router.get("/", isTokenValid, getAllModules);
router.get("/module:id", getModule);
router.post("/:courseId", createModule);
router.put("/:moduleId", updateModule);


module.exports = router;