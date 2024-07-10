const { Sequelize } = require("sequelize");
const { projectService } = require("../projectService");
const { Project, User, Like } = require("../../entities/associations");

// Mock die Entitäten
jest.mock("../../entities/associations", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();

  const ProjectMock = dbMock.define("Project", {});
  const UserMock = dbMock.define("User", {});
  const LikeMock = dbMock.define("Like", {});

  return {
    Project: ProjectMock,
    User: UserMock,
    Like: LikeMock,
  };
});

let service;

beforeEach(() => {
  service = new projectService();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("sollte ein neues Projekt erstellen", async () => {
  const mockProject = {
    id: 1,
    projectName: "Testprojekt",
    description: "Testbeschreibung",
    bpm: 120,
    userId: 1,
    visibility: true,
  };
  Project.create = jest.fn().mockResolvedValue({
    ...mockProject,
    createdAt: new Date(),
    updatedAt: new Date(),
    isImportable: false,
    likes: 0,
  });
  Project.sync = jest.fn().mockResolvedValue(undefined);

  const result = await service.createProject(
    mockProject.projectName,
    mockProject.description,
    mockProject.bpm,
    mockProject.userId,
    mockProject.visibility
  );

  expect(result.projectName).toEqual(mockProject.projectName);
  expect(result.description).toEqual(mockProject.description);
  expect(result.bpm).toEqual(mockProject.bpm);
  expect(result.userId).toEqual(mockProject.userId);
  expect(result.visibility).toEqual(mockProject.visibility);
  // expect(Project.create).toHaveBeenCalledWith({
  //   projectName: mockProject.projectName,
  //   description: mockProject.description,
  //   bpm: mockProject.bpm,
  //   userId: mockProject.userId,
  //   visibility: mockProject.visibility,
  // });
});
