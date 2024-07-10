import mixerEntity from "../entities/mixerEntity";
import drummachineEntity from "./entities/drummachineEntity/";


class MixerService {
  //CRUD-Implemention:
  //(Mehr nötig?)

  //Create:
  async createMixer(mixerData) {
    try {
      if (!Array.isArray(mixerData.panlist)) {
        throw new ValidationError("Panlist must be an array of floats");
      }

      const newMixer = await mixerEntity.create(mixerData);
      logger.info(`Mixer created: ${newMixer.id}`);
      return newMixer;
    } catch (error) {
      logger.error(`Error creating mixer: ${error.message}`);
      throw error;
    }
  }

  //Read
  async getMixerById(mixerId) {
    try {
      const mixer = await mixerEntity.findByPk(mixerId, {
        include: [drummachineEntity],
      });
      if (!mixer) {
        throw new Error("Mixer not found");
      }
      return mixer;
    } catch (error) {
      logger.error(`Error fetching mixer: ${error.message}`);
      throw error;
    }
  }

  //Update

  async updateMixer(mixerId, mixerData) {
    try {
      const mixer = await mixerEntity.findByPk(mixerId);
      if (!mixer) {
        throw new Error("Mixer not found");
      }

      await mixer.update(mixerData);
      logger.info(`Mixer updated: ${mixer.id}`);
      return mixer;
    } catch (error) {
      logger.error(`Error updating mixer: ${error.message}`);
      throw error;
    }
  }

  //Delete

  async deleteMixer(mixerId) {
    try {
      const mixer = await mixerEntity.findByPk(mixerId);
      if (!mixer) {
        throw new Error("Mixer not found");
      }

      await mixer.destroy();
      logger.info(`Mixer deleted: ${mixer.id}`);
    } catch (error) {
      logger.error(`Error deleting mixer: ${error.message}`);
      throw error;
    }
  }
}

export default new MixerService();
