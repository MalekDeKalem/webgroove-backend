const { Sequelize, DataTypes } = require("sequelize");
const userEntity = require("../entities/userEntity");
const projectEntity = require("../entities/projectEntity");
const { User, Project, Like } = require("../entities/associations");
const { sequelize } = require("../entities/db-connection");

class projectService {
  constructor() { }

  async createProject(projectName, description, bpm, userId, isPublic, isImportable) {
    try {
      // falls die Tabelle noch nicht existiert, erstelle sie
      // console.log(projectName, description, bpm, userId, isPublic)
      await projectEntity.sync({})
      const newProject = await projectEntity.create({
        projectName: projectName,
        description: description,
        bpm: bpm,
        userId: userId,
        visibility: isPublic,
        isImportable: isImportable
      });
      return newProject;
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  }


  async getprojectsByUserId(userId) {
    try {
      const projects = await projectEntity.findAll({
        where: {
          userId: userId
        },
      });
      return projects;
    } catch (error) {
      throw new Error(`Fehler beim Suchen von Projekten des Benutzers mit der ID ${userId}: ${error.message}`);
    }
  }


  async getProjectById(projectId) {
    try {
      const project = await projectEntity.findByPk(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw new Error(`Error getting project by ID: ${error.message}`);
    }
  }

  async updateProject(projectId, newData) {
    try {
      const project = await projectEntity.findByPk(projectId);
      if (!project) {
        console.log(newData)
        throw new Error("Project not found");
      }

      await project.update({
        projectName: newData.projectName,
        description: newData.description,
        bpm: newData.bpm,
        visibility: newData.visibility,
        isImportable: newData.isImportable,
      }

      );
      return project;
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  async deleteProject(projectId) {
    try {
      const project = await projectEntity.findByPk(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      await project.destroy();
      return project;
    } catch (error) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }

  // Neue Methode, um öffentliche Projekte abzurufen (mudi)
  async getPublicProjects() {
    try {
      // console.log("Suche Projekte...");
      const publicProjects = await projectEntity.findAll({
        where: { visibility: true },
        include: [
          {
            model: userEntity,
            attributes: ['username', 'id','country']
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."projectId" = "Project"."id")'), 'likeCount']
          ]
        },
        // group: ['Project.id'], // Gruppierung nach Projekt-ID, um die Anzahl der Likes korrekt zu zählen
      });

      return publicProjects;
    } catch (error) {
      throw new Error('Fehler beim Abrufen der öffentlichen Projekte: ' + error.message);
    }
  }




}

module.exports = { projectService }
