import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserModel } from "../../../src/models/user.model";
import { userController } from "../../../src/controllers/user.controller";

let mongoServer: MongoMemoryServer;


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User Controller", () => {
  it("debería crear un usuario", async () => {
    const req = {
      body: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "securepassword",
        id: "123",
        role: "regularUser",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    await userController.createUser(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: "john.doe@example.com" }));

    const userInDb = await UserModel.findOne({ email: "john.doe@example.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe("John Doe");
  });


  it("debería eliminar un usuario", async () => {
    const user = await UserModel.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      id: "126",
      role: "regularUser",
    });

    const req = { params: { id: user.id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    await userController.deleteUser(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(204);
    const userInDb = await UserModel.findOne({ id: "126" });
    expect(userInDb).toBeNull();
  });

  it("debería devolver un error si el usuario a eliminar no existe", async () => {
    const req = { params: { id: "999" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    await userController.deleteUser(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith("User 999 whit name undefined not found");
  });
});