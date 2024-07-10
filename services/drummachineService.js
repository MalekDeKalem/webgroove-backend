const drummachineEntity = require("../entities/drummachineEntity");


class drummachineService {
  constructor() {}

  async createDrummachine(userId, projectId, drumSequencePattern) {
    try {

      await drummachineEntity.sync({});

      const newDrummachine = await drummachineEntity.create({
        userId: userId, 
        projectId: projectId,
        drumSequence: drumSequencePattern
      });
      
      return newDrummachine;
    } catch (error) {
      throw new Error(`Error creating drum machine: ${error.message}`);
    }
  }

  async getDrummachineById(drummachineId) {
    try {
      const drummachine = await drummachineEntity.findByPk(drummachineId);
      if (!drummachine) {
        throw new Error("Drummachine not found");
      }
      console.log("drum pattern gefunden")
      return drummachine;
    } catch (error) {
      throw new Error(`Error getting drum machine by ID: ${error.message}`);
    }
  }

  async getDrummachineByProjectId(projectId) {
    try {
      const drummachine = await drummachineEntity.findOne({where: {projectId: projectId}});
      if (!drummachine) {
        throw new Error("Drummachine not found");
      }

      return drummachine;
    } catch (error) {
      throw new Error(`Error getting drum machine by ID: ${error.message}`);
    }
  }

  async updateDrummachine(userId, projectId, newPattern, gainDrum, panDrum, soloDrum, muteDrum,effectDrum) {
    try {
      const drummachine = await drummachineEntity.findOne({
        where: {
          userId: userId, 
          projectId: projectId
        }});

      if (!drummachine) {
        throw new Error("Drummachine not found");
      }
      await drummachine.update({drumSequence: newPattern, gainDrum: gainDrum, panDrum:panDrum, soloDrum: soloDrum, muteDrum: muteDrum, effectDrum: effectDrum});
      return drummachine;
    } catch (error) {
      throw new Error(`Error updating drum machine: ${error.message}`);
    }
  }

  async deleteDrummachine(drummachineId) {
    try {
      const drummachine = await drummachineEntity.findByPk(drummachineId);
      if (!drummachine) {
        throw new Error("Drummachine not found");
      }
      await drummachine.destroy();
      return drummachine;
    } catch (error) {
      throw new Error(`Error deleting drum machine: ${error.message}`);
    }
  }
}

module.exports = {drummachineService} ;
