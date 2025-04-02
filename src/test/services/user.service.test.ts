import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserModel, UserInput } from "../../../src/models/user.model";
import { userService } from "../../../src/services";
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

describe("User Service", () => {
  it("debería crear un usuario", async () => {
    const userInput: UserInput = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      id: "123",
      role: "regularUser",
    };

    const user = await userService.createUser(userInput);

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");

    const userInDb = await UserModel.findOne({ email: "john.doe@example.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe("John Doe");
  });

  it("debería encontrar un usuario por ID", async () => {
    await UserModel.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "securepassword",
      id: "124",
      role: "regularUser",
    });

    const foundUser = await userService.findById("124");

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe("jane.doe@example.com");
  });

  it("debería actualizar un usuario", async () => {
    await UserModel.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "securepassword",
      id: "125",
      role: "regularUser",
    });

    const updatedUser = await userService.updateUser("125", {
      name: "Jane Smith",
      email: "jane.doe@example.com",
      password: "securepassword",
      id: "125",
      role: "regularUser",
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("Jane Smith");

    const userInDb = await UserModel.findOne({ id: "125" });
    expect(userInDb?.name).toBe("Jane Smith");
  });

  it("debería eliminar un usuario", async () => {
    await UserModel.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      id: "126",
      role: "regularUser",
    });

    const deletedUser = await userService.deleteUser("126");

    expect(deletedUser).toBeDefined();
    expect(deletedUser?.id).toBe("126");

    const userInDb = await UserModel.findOne({ id: "126" });
    expect(userInDb).toBeNull();
  });

  it("debería devolver null si el usuario no existe", async () => {
    const user = await userService.deleteUser("999");

    expect(user).toBeNull();
  });
});