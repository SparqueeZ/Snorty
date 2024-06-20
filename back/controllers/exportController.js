const { create } = require("tar");
const fs = require("fs");
const { getReadableTimestampParis } = require("../utils/dateUtils");
const {
  writeRulesToFile,
  archiveRulesDirectory,
} = require("../utils/fileUtils");

exports.downloadRules = (req, res) => {
  console.log(`${getReadableTimestampParis()} GET Request : downloadRules`);

  const archivesDirectory = "archives";

  try {
    const archives = fs.readdirSync(archivesDirectory);
    const tarArchives = archives.filter((file) => file.endsWith(".tar.gz"));

    if (tarArchives.length === 0) {
      console.error("Aucune archive .tar.gz trouvée.");
      res.status(404).send({ message: "Aucune archive .tar.gz trouvée." });
      return;
    }

    let latestArchive = tarArchives[0];
    let latestDate = fs.statSync(`${archivesDirectory}/${latestArchive}`).mtime;

    for (let i = 1; i < tarArchives.length; i++) {
      const currentArchive = tarArchives[i];
      const currentDate = fs.statSync(
        `${archivesDirectory}/${currentArchive}`
      ).mtime;
      if (currentDate > latestDate) {
        latestArchive = currentArchive;
        latestDate = currentDate;
      }
    }

    const archivePath = `${archivesDirectory}/${latestArchive}`;
    res.download(archivePath, (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement de l'archive :", err);
        res
          .status(500)
          .send({ message: "Erreur lors du téléchargement de l'archive." });
      }
    });
  } catch (error) {
    console.error(
      "Une erreur est survenue lors du téléchargement de l'archive :",
      error
    );
    res.status(500).send({
      message: "Une erreur est survenue lors du téléchargement de l'archive.",
      data: error,
    });
  }
};

exports.exportRule = (req, res) => {
  console.log(`${getReadableTimestampParis()} POST Request : exportRule`);

  const ruleData = req.body;
  writeRulesToFile(ruleData, res);
};
