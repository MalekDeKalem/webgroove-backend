const { sequelize } = require("../../entities/db-connection");
const userEntity = require("../../entities/userEntity");
const projectEntity = require("../../entities/projectEntity");
const drummachineEntity = require("../../entities/drummachineEntity");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  // Clear the database after each test
  await userEntity.destroy({ where: {}, truncate: true });
  await projectEntity.destroy({ where: {}, truncate: true });
  await drummachineEntity.destroy({ where: {}, truncate: true });
});

test("should create a drummachine with associations", async () => {
  const user = await userEntity.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword",
  });

  const project = await projectEntity.create({
    projectName: "testproject",
    bpm: 120,
    userId: user.id,
  });

  const drummachine = await drummachineEntity.create({
    patternName: "testpattern",
    drumSequence: { kick: [0, 1, 0, 1] },
    gainDrum: { kick: 0.8 },
    panDrum: { kick: 0 },
    soloDrum: { kick: false },
    muteDrum: { kick: false },
    effectDrum: { kick: "reverb" },
    userId: user.id,
    projectId: project.id,
  });

  expect(drummachine).toBeDefined();
  expect(drummachine.patternName).toBe("testpattern");
  expect(drummachine.drumSequence).toEqual({ kick: [0, 1, 0, 1] });
  expect(drummachine.gainDrum).toEqual({ kick: 0.8 });
  expect(drummachine.panDrum).toEqual({ kick: 0 });
  expect(drummachine.soloDrum).toEqual({ kick: false });
  expect(drummachine.muteDrum).toEqual({ kick: false });
  expect(drummachine.effectDrum).toEqual({ kick: "reverb" });
  expect(drummachine.userId).toBe(user.id);
  expect(drummachine.projectId).toBe(project.id);
});

test("should not create a drummachine without userId or projectId", async () => {
  await expect(
    drummachineEntity.create({
      patternName: "testpattern",
      drumSequence: { kick: [0, 1, 0, 1] },
    })
  ).rejects.toThrow();

  await expect(
    drummachineEntity.create({
      patternName: "testpattern",
      drumSequence: { kick: [0, 1, 0, 1] },
      userId: 1,
    })
  ).rejects.toThrow();

  await expect(
    drummachineEntity.create({
      patternName: "testpattern",
      drumSequence: { kick: [0, 1, 0, 1] },
      projectId: 1,
    })
  ).rejects.toThrow();
});
