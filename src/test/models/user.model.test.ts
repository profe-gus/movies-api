import mongoose from "mongoose";
import { UserModel, UserInput } from "../../../src/models/user.model";

import { MongoMemoryServer } from "mongodb-memory-server";

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

it("debería crear un usuario válido", async () => {
  const userInput: UserInput = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword",
    id: "123",
    role: "regularUser",
  };

  const user = new UserModel(userInput);
  const savedUser = await user.save();

  expect(savedUser._id).toBeDefined();
  expect(savedUser.name).toBe(userInput.name);
  expect(savedUser.email).toBe(userInput.email);
  expect(savedUser.role).toBe(userInput.role);
});

it("debería fallar si falta un campo requerido", async () => {
  const userInput = {
    email: "john.doe@example.com",
    password: "securepassword",
    id: "12345",
    role: "regularUser",
  };

  const user = new UserModel(userInput as UserInput);

  await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
});

it("debería asignar el rol por defecto si no se proporciona", async () => {
  const userInput = {
    name: "Default Role User",
    email: "default.role@example.com",
    password: "securepassword",
    id: "126",
  };

  const user = new UserModel(userInput as UserInput);
  const savedUser = await user.save();

  expect(savedUser.role).toBe("regularUser");
});

it("debería fallar si el ID no es único", async () => {
  const userInput: UserInput = {
    name: "User One",
    email: "user.one@example.com",
    password: "securepassword",
    id: "127",
    role: "regularUser",
  };

  const duplicateUserInput: UserInput = {
    name: "User Two",
    email: "user.two@example.com",
    password: "securepassword",
    id: "127", // Mismo ID
    role: "regularUser",
  };

  const user1 = new UserModel(userInput);
  await user1.save();

  const user2 = new UserModel(duplicateUserInput);

  await expect(user2.save()).rejects.toThrow("El ID ya está en uso");
});

it("debería permitir guardar un usuario con un rol válido", async () => {
  const userInput: UserInput = {
    name: "Admin User",
    email: "admin.user@example.com",
    password: "securepassword",
    id: "128",
    role: "SuperAdmin",
  };

  const user = new UserModel(userInput);
  const savedUser = await user.save();

  expect(savedUser.role).toBe("SuperAdmin");
});