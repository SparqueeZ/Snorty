const SELKSAlert = require("../models/SELKSAlert");
const SELKSRule = require("../models/SELKSRule");
const { getReadableTimestampParis } = require("../utils/dateUtils");

exports.getAlerts = async (req, res) => {
  console.log(`${getReadableTimestampParis()} GET Request : getAlerts`);
  try {
    const alerts = await SELKSAlert.find();
    res.json(alerts);
  } catch (error) {
    console.error("Erreur lors de la récupération des alertes :", error);
    res.status(500).json({ error: "Failed to retrieve alerts" });
  }
};

exports.storeAlert = async (req, res) => {
  const { alert } = req.body;
  console.log(`${getReadableTimestampParis()} POST Request : storeAlerts`);

  try {
    const newAlert = new SELKSAlert(alert);
    await newAlert.save();
    res.status(200).json({ message: "Alert stored successfully" });
  } catch (error) {
    console.error("Erreur lors du stockage de l'alerte :", error);
    res.status(500).json({ error: "Failed to store alert" });
  }
};

exports.getRules = async (req, res) => {
  console.log(`${getReadableTimestampParis()} GET Request : getRules`);

  try {
    const rules = await SELKSRule.find();
    res.json(rules);
  } catch (error) {
    console.error("Erreur lors de la récupération des règles :", error);
    res.status(500).json({ error: "Failed to retrieve rules" });
  }
};

exports.storeRule = async (req, res) => {
  const data = req.body;

  console.log(`${getReadableTimestampParis()} POST Request : storeRule`);

  try {
    const newRule = new SELKSRule(data);
    await newRule.save();
    res.status(200).json({ message: "Rule stored successfully" });
  } catch (error) {
    console.error("Error storing the rule:", error);
    res
      .status(500)
      .json({ error: "Failed to store rule", details: error.message });
  }
};

exports.updateRule = async (req, res) => {
  const { rule } = req.body;

  console.log(`${getReadableTimestampParis()} POST Request : updateRule`);

  if (!rule.sid) {
    return res.status(400).json({ error: "sid is required" });
  }

  try {
    const existingRule = await SELKSRule.findOne({ sid: rule.sid });

    if (!existingRule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    const preservedNewSid = existingRule.new_sid;

    const updatedRuleData = { ...rule, new_sid: preservedNewSid };

    const updatedRule = await SELKSRule.findOneAndUpdate(
      { sid: rule.sid }, // Critère de recherche basé sur le `sid`
      updatedRuleData, // Nouvelle règle avec `new_sid` préservé
      {
        new: true, // Retourne le document modifié
        runValidators: true, // Exécute les validateurs définis dans le schéma
      }
    );

    res.status(200).json({ message: "Rule updated successfully", updatedRule });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la règle :", error);
    res.status(500).json({ error: "Failed to update rule" });
  }
};

exports.updateAlert = async (req, res) => {
  const { id, alert } = req.body;

  console.log(`${getReadableTimestampParis()} POST Request : updateAlert`);

  // Validation pour s'assurer que les champs obligatoires sont présents
  const requiredFields = [
    "src_ip",
    "src_port",
    "dest_ip",
    "dest_port",
    "alert.signature_id",
  ];
  const missingFields = requiredFields.filter(
    (field) => !field.split(".").reduce((o, i) => (o ? o[i] : null), alert)
  );

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    const updatedAlert = await SELKSAlert.findOneAndUpdate(
      { _id: id },
      { $set: alert },
      { new: true, runValidators: true }
    );

    if (updatedAlert) {
      res
        .status(200)
        .json({ message: "Alert updated successfully", updatedAlert });
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'alerte :", error);
    res.status(500).json({ error: "Failed to update alert" });
  }
};

exports.removeAlert = async (req, res) => {
  const { id } = req.body;

  console.log(`${getReadableTimestampParis()} POST Request : removeAlert`);

  try {
    const deletedAlert = await SELKSAlert.findOneAndDelete({ _id: id });

    if (deletedAlert) {
      res
        .status(200)
        .json({ message: "Alert deleted successfully", deletedAlert });
    } else {
      res.status(404).json({ error: "Alert not found" });
    }
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
};
