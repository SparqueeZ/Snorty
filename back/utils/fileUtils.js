const fs = require("fs");
const { create } = require("tar");
const { getReadableTimestampParis } = require("./dateUtils");

exports.writeRulesToFile = (ruleData, res) => {
  const rulesText = ruleData.join("\n");
  const rulesFilePath = "rules/rules.rules";

  if (!fs.existsSync("rules")) {
    fs.mkdirSync("rules");
  }

  fs.writeFile(rulesFilePath, rulesText, (err) => {
    if (err) {
      console.error("Erreur lors de l'écriture du fichier : ", err);
      res.status(500).send({ message: "Erreur lors de l'écriture du fichier" });
    } else {
      console.log("Fichier 'rules.rules' créé avec succès.");
      archiveRulesDirectory(res);
    }
  });
};

exports.archiveRulesDirectory = async (res) => {
  const formattedDate = getReadableTimestampParis();
  const directoryToArchive = "./rules";
  const archiveFileName = `archives/rules_${formattedDate}.tar.gz`;

  try {
    if (!fs.existsSync(directoryToArchive)) {
      console.error("Le dossier à archiver n'existe pas.");
      res.status(500).send({ message: "Le dossier à archiver n'existe pas." });
      return;
    }

    let filesToInclude = fs.readdirSync(directoryToArchive);

    if (!filesToInclude.includes("rules.rules")) {
      filesToInclude.push("rules.rules");
    }

    await create(
      {
        gzip: true,
        file: archiveFileName,
        cwd: directoryToArchive,
      },
      filesToInclude
    );

    console.log(`L'archive ${archiveFileName} a été créée avec succès.`);
    res.status(200).send({
      message: `L'archive ${archiveFileName} a été créée avec succès.`,
    });
  } catch (error) {
    console.error("Une erreur est survenue lors de l'archivage :", error);
    res
      .status(500)
      .send({ message: "Une erreur est survenue lors de l'archivage." });
  }
};

archiveRulesDirectory = async (res) => {
  const formattedDate = getReadableTimestampParis();
  const directoryToArchive = "./rules";
  const archiveFileName = `archives/rules_${formattedDate}.tar.gz`;

  try {
    if (!fs.existsSync(directoryToArchive)) {
      console.error("Le dossier à archiver n'existe pas.");
      res.status(500).send({ message: "Le dossier à archiver n'existe pas." });
      return;
    }

    let filesToInclude = fs.readdirSync(directoryToArchive);

    if (!filesToInclude.includes("rules.rules")) {
      filesToInclude.push("rules.rules");
    }

    await create(
      {
        gzip: true,
        file: archiveFileName,
        cwd: directoryToArchive,
      },
      filesToInclude
    );

    console.log(`L'archive ${archiveFileName} a été créée avec succès.`);
    res.status(200).send({
      message: `L'archive ${archiveFileName} a été créée avec succès.`,
    });
  } catch (error) {
    console.error("Une erreur est survenue lors de l'archivage :", error);
    res
      .status(500)
      .send({ message: "Une erreur est survenue lors de l'archivage." });
  }
};
