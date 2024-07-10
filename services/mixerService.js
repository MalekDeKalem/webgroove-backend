const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(/*  */);

const Mixer = sequelize.define("Mixer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  panlist: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true,
  },
});

class MixerService {
  constructor() {}

  async createMixer(panlist) {
    try {
      const newMixer = await Mixer.create({ panlist });
      return newMixer;
    } catch (error) {
      throw new Error(`Error creating mixer: ${error.message}`);
    }
  }

  async getMixerById(mixerId) {
    try {
      const mixer = await Mixer.findByPk(mixerId);
      if (!mixer) {
        throw new Error("Mixer not found");
      }
      return mixer;
    } catch (error) {
      throw new Error(`Error getting mixer by ID: ${error.message}`);
    }
  }

  async updateMixer(mixerId, newData) {
    try {
      const mixer = await Mixer.findByPk(mixerId);
      if (!mixer) {
        throw new Error("Mixer not found");
      }
      await mixer.update(newData);
      return mixer;
    } catch (error) {
      throw new Error(`Error updating mixer: ${error.message}`);
    }
  }

  async deleteMixer(mixerId) {
    try {
      const mixer = await Mixer.findByPk(mixerId);
      if (!mixer) {
        throw new Error("Mixer not found");
      }
      await mixer.destroy();
      return mixer;
    } catch (error) {
      throw new Error(`Error deleting mixer: ${error.message}`);
    }
  }
}

export default MixerService;
