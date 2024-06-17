const express = require("express");
const {
  downloadRules,
  exportRule,
} = require("../controllers/exportController");

const router = express.Router();

router.get("/download-rules", downloadRules);
router.post("/export-rule", exportRule);

module.exports = router;
