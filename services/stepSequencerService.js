const { Sequelize, DataTypes } = require("sequelize");
const userEntity = require("../entities/userEntity");
const stepsequencerEntity = require("../entities/stepsequencerEntity");

class stepSequencerService {
  constructor() {}

  async createStepsequencer(userId, projectId, stepSequencePattern) {
    try {
      await stepsequencerEntity.sync({})

      const newStepsequencer = await stepsequencerEntity.create({
        userId: userId,
        projectId: projectId,
        stepSequence: stepSequencePattern
      });

      return newStepsequencer;
    } catch (error) {
      throw new Error(`Error creating step sequencer: ${error.message}`);
    }
  }

  async getStepsequencerById(stepsequencerId) {
    try {
      const stepsequencer = await stepsequencerEntity.findByPk(stepsequencerId);
      if (!stepsequencer) {
        throw new Error("Step sequencer not found");
      }
      console.log("seq pattern gefunden")

      return stepsequencer;
    } catch (error) {
      throw new Error(`Error getting step sequencer by ID: ${error.message}`);
    }
  }

  async getStepsequencerByProjectId(projectId) {
    try {
      const stepsequencer = await stepsequencerEntity.findOne({where: {projectId: projectId}});

      if (!stepsequencer) {
        throw new Error("Step sequencer not found");
      }
            
      return stepsequencer;
    } catch (error) {
      throw new Error(`Error getting step sequencer by ID: ${error.message}`);
    }
  }

  async updateStepsequencer(userId, projectId, newPattern, synthVol, synthPitch, synthPan, adsr, effectSynth,waveTableIndex,scale) {
    try {
      const stepsequencer = await stepsequencerEntity.findOne({
        where: {
          userId: userId, 
          projectId: projectId
        }});
      if (!stepsequencer) {
        throw new Error("Step sequencer not found");
      }

      await stepsequencer.update({stepSequence: newPattern, volume: synthVol, pitch: synthPitch, pan: synthPan, adsr: adsr, effectSynth: effectSynth, waveTableIndex: waveTableIndex, scale: scale});
      return stepsequencer;
    } catch (error) {
      throw new Error(`Error updating step sequencer: ${error.message}`);
    }
  }

  async deleteStepsequencer(stepsequencerId) {
    try {
      const stepsequencer = await stepsequencerEntity.findByPk(stepsequencerId);
      if (!stepsequencer) {
        throw new Error("Step sequencer not found");
      }
      await stepsequencer.destroy();
      return stepsequencer; // Rückgabe des gelöschten Stepsequencers
    } catch (error) {
      throw new Error(`Error deleting step sequencer: ${error.message}`);
    }
  }
}

module.exports = {stepSequencerService} ;
