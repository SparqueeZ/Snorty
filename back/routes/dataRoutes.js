const express = require("express");
const {
  getAlerts,
  storeAlert,
  getRules,
  storeRule,
  updateRule,
  updateAlert,
  removeAlert,
} = require("../controllers/dataController");

const router = express.Router();

router.get("/getAlerts", getAlerts);
router.post("/storeAlert", storeAlert);
router.get("/getRules", getRules);
router.post("/storeRule", storeRule);

router.post("/updateRule", updateRule);
router.post("/updateAlert", updateAlert);
router.post("/removeAlert", removeAlert);

module.exports = router;
