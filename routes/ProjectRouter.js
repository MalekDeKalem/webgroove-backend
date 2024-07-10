const express = require("express");

const projectRouter = express.Router();

const { projectService } = require("../services/projectService");
const { stepSequencerService } = require("../services/stepSequencerService");
const { drummachineService } = require("../services/drummachineService");
const { userService } = require("../services/userService");
const Like = require("../entities/likes");
const userEntity = require("../entities/userEntity");

const project = new projectService();
const stepSequenceService = new stepSequencerService();
const drumSequenceService = new drummachineService();
const user = new userService();

projectRouter.post("/new", async (req, res) => {
  try {
    console.log("neues Projekt anlegen...");
    const {
      projectName,
      isPublic,
      isImportable,
      bpm,
      description,
      userId,
      stepSequencePattern,
      drumSequencePattern,
    } = req.body;

    const newProject = await project.createProject(
      projectName,
      description,
      bpm,
      userId,
      isPublic,
      isImportable,
    ); 

    const stepSequence = await stepSequenceService.createStepsequencer(
      userId,
      newProject.id,
      stepSequencePattern
    );
    const drumSequence = await drumSequenceService.createDrummachine(
      userId,
      newProject.id,
      drumSequencePattern
    );

    res.status(201).json({
      message: "neues Projekt erfolgreich erstellt",
      projectDetails: {
        projectId: newProject.id,
        seqPatternId: stepSequence.id,
        drumPatternId: drumSequence.id,
      },
    });
  } catch (error) {
    // console.error("Fehler beim Speichern des Projekts:", error);
    res.status(500).json({ message: "Interner Serverfehler", error });
  }
});

//  Diese Funktion speichert ein  Musikprojekt. Sie erwartet eine POST-Anfrage mit den folgenden Parametern
//  im Anfrage-Body (req.body):
//
//  - projectName: Der Name des Projekts.
//  - isPublic: Ein Boolean-Wert, der angibt, ob das Projekt öffentlich ist.
//  - bpm: Die BPM (Beats per Minute) des Projekts.
//  - description: Eine Beschreibung des Projekts.
//  - activeSynths: Eine Liste der aktiven Synthesizer.
//  - activeDrums: Eine Liste der aktiven Schlagzeugspuren.
//  - userId: Die ID des Benutzers, der das Projekt erstellt.
projectRouter.post("/save", async (req, res, next) => {
  try {
    console.log(" Projekt speichern...");
    const {
      projectId,
      projectName,
      isPublic,
      isImportable,
      bpm,
      description,
      activeSynths,
        synthVol,
        synthPitch,
        synthPan,
        adsr,
        effectSynth,
        waveTableIndex,
        scale,
      userId,
        activeDrums,
        gainDrum,
        panDrum,
        soloDrum,
        muteDrum, 
        effectDrum,
  
    } = req.body;

    const projectData = {
      projectId: projectId,
      projectName: projectName,
      description: description,
      bpm: bpm,
      visibility: isPublic,
      isImportable: isImportable,
    };

    console.log(projectData)
    const newProject = await project.updateProject(projectId, projectData);
    const stepSequence = await stepSequenceService.updateStepsequencer(
      userId,
      newProject.id,
      activeSynths,
      synthVol,
      synthPitch,
      synthPan,
      adsr,
      effectSynth,
      waveTableIndex,
      scale,
    );

    const drumSequence = await drumSequenceService.updateDrummachine(
      userId,
      newProject.id,
      activeDrums,
      gainDrum,
      panDrum,
      soloDrum,
      muteDrum,
      effectDrum,
    );
    console.log("fertig!");
    res.status(201).json({
      message: "Projekt erfolgreich gespeichert",
      projectDetails: {
        projectId: newProject.id,
        stepSequenceId: stepSequence.id,
        drumSequenceId: drumSequence.id,
      },
    });
  } catch (error) {
    // console.error("Fehler beim Speichern des Projekts:", error);
    res.status(500).json({ message: "Interner Serverfehler", error });
  }
});

// Diese Funktion gibt alle Projekte eines bestimmten Benutzers in Form eines Arrays zurück.
// Die userId wird aus den Query-Parametern entnommen.

// Beispiel einer Anfrage-URL im Frontend(siehe openProjectDialog.svelte Z.13):
// http://localhost:3999/api/projects/open?userId=${userId}
projectRouter.get("/open", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const openProjects = await project.getprojectsByUserId(userId);

    res
      .status(200)
      .json({ openProjects, message: "Projekte von erfolgreich gefunden" });
  } catch (error) {
    // console.error("Fehler beim Finden der Projekte von Benutzer mit ID:", userId, "Fehler: ", error);
    res.status(500).json({ message: "Interner Serverfehler", error });
  }
});

// Route, um alle öffentlichen Projekte abzurufen (mudi)
projectRouter.get("/public", async (req, res, next) => {
  try {
    const publicProjects = await project.getPublicProjects();
    // console.log(publicProjects);
    res
      .status(200)
      .json({
        publicProjects,
        message: "Öffentliche Projekte erfolgreich abgerufen",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Interner Serverfehler", error: error.message });
  }
});

// Route um Infos eines Projektes Info zu ändern
projectRouter.put("/:projectid", async (req, res, next) => {
  const { projectName, description, bpm, visibility, isImportable } = req.body;
  const newData = {
    projectName,
    description,
    bpm,
    visibility,
    isImportable,
  };
  // console.log(req.params.projectid)
  console.log(newData)

  try {
    const newProjectInfo = await project.updateProject(
      req.params.projectid,
      newData
    );
    res.status(201).json({ newProjectInfo, message: "Projekt Info geändert" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Interner Serverfehler", error: error.message });
  }
});

projectRouter.get("/:projectId/patterns", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    console.log(projectId)
    const stepSeqEntity = await stepSequenceService.getStepsequencerByProjectId(
      projectId
    );
    const drumEntity = await drumSequenceService.getDrummachineByProjectId(
      projectId
    );
    const owner = await user.getUserById(stepSeqEntity.userId);
    res.status(200).json({
      message: "Patterns erfolgreich geladen",
      owner: owner.username,
      ownerId: owner.id,
      patterns: {
        stepSequence: stepSeqEntity,
        drumSequence: drumEntity,
      },
    });
  } catch (error) {
    console.error("Fehler beim Laden der Patterns:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Route, um ein Projekt zu liken
projectRouter.post("/:projectId/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;

    // console.log("Request Body:", req.body);
    // console.log("Project ID:", projectId);
    // console.log("User ID:", userId);

    // Erstellen Sie das Like in der Datenbank
    await Like.create({ userId: userId, projectId: projectId });

    res.status(201).send("Projekt wurde geliked");
  } catch (error) {
    console.error("Fehler beim Liken des Projekts:", error);
    res.status(500).send("Fehler beim Liken des Projekts");
  }
});

// Route, um ein Projekt zu entliken
projectRouter.delete("/:projectId/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;
    await Like.destroy({ where: { userId, projectId } });
    res.status(200).send("Projekt wurde entlikt");
  } catch (error) {
    res.status(500).send("Fehler beim Entliken des Projekts");
  }
});

// Route, um die Anzahl der Likes eines Projekts abzurufen
projectRouter.get("/:projectId/likes", async (req, res) => {
  try {
    const { projectId } = req.params;
    const likeCount = await Like.count({ where: { projectId } });
    res.status(200).json({ likeCount });
  } catch (error) {
    res.status(500).send("Fehler beim Abrufen der Likes des Projekts");
  }
});

// Route, um alle Nutzer anzuzeigen, die ein Projekt geliket haben
projectRouter.get("/:projectId/likedby", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Finde alle Likes für das gegebene Projekt
    const likes = await Like.findAll({
      where: { projectId },
      include: [{ model: userEntity, attributes: ["id", "username"] }], // Verknüpfe mit dem User-Modell, um Benutzerdaten abzurufen
    });

    // Extrahiere Benutzer aus den Like-Datensätzen
    const users = likes.map((like) => like.User);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Fehler beim Abrufen der geliketen Benutzer:", error);
    res.status(500).send("Fehler beim Abrufen der geliketen Benutzer");
  }
});

// Funktion zum Löschen eines Projekts
// es wird vorrausgesetzt, dass der Client seine userId und sein JWT zur authentifizierung im body mitgibt
projectRouter.delete("/:projectid", async (req, res, next) => {
  try {
    const { userId, jwtToken } = req.body;

    // Überprüfen der JWT-Token-Authentifizierung
    const auth = await user.compareJWT(userId, jwtToken);
    if (!auth.success) {
      throw new Error("Fehler bei der Authentifizierung. Bitte versuchen Sie es später erneut.");
    }

    await project.deleteProject(req.params.projectid);

    res.status(200).json({ message: "Projekt erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Projekts:", error);
    res.status(500).json({ message: "Interner Serverfehler", error: error.message });
  }
});

module.exports = projectRouter;

//////////////NEUE ROUTE, die das Projekt als Array nutzt (noch testweise):

// const projectRouterArray = [
//   { method: "post", route: "/new", handler: createProject },
//   { method: "post", route: "/save", handler: saveProject },
//   { method: "get", route: "/open", handler: openProjects },
//   { method: "get", route: "/public", handler: getPublicProjects },
//   { method: "put", route: "/:projectid", handler: updateProject },
//   { method: "get", route: "/:projectId/patterns", handler: getProjectPatterns },
//   { method: "post", route: "/:projectId/like", handler: likeProject },
//   { method: "delete", route: "/:projectId/like", handler: unlikeProject },
//   { method: "get", route: "/:projectId/likes", handler: getProjectLikes },
//   {
//     method: "get",
//     route: "/:projectId/likedby",
//     handler: getProjectLikedByUsers,
//   },
// ];

// projectRouterArray.forEach((route) => {
//   projectRouter[route.method](route.route, route.handler);
// });

module.exports = projectRouter;
