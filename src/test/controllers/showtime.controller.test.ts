import { Request, Response } from "express";
import { showtimeController } from "../../../src/controllers";
import { showtimeService } from "../../../src/services";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Showtime } from "../../../src/models";

jest.mock("../../src/services/showtime.service");

let mongoServer: MongoMemoryServer;

let req: Partial<Request>;
let res: Partial<Response>;
let next: jest.Mock;
let jsonMock: jest.Mock;
let statusMock: jest.Mock;

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


beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    next = jest.fn();

    req = {
      body: {
        pelicula: new mongoose.Types.ObjectId(),
        fechaHora: new Date(),
        precio: 20000,
        disponibilidad: 100,
        estado: "Disponible",
      },
    };
    res = { status: statusMock, json: jsonMock };
});


describe("ShowtimeController", () => {
  it("Create Showtime", async () => {
    req = {
      body: {
        pelicula: new mongoose.Types.ObjectId(), // ObjectId válido
        fechaHora: new Date(),
        precio: 20000,
        disponibilidad: 100,
        estado: "Disponible",
      },
    };
  
    const mockShowtime = {
      _id: "testShowtimeId",
      ...req.body 
    };
  
    (showtimeService.createShowtime as jest.Mock).mockResolvedValue(mockShowtime);

    await showtimeController.createShowtime(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ pelicula: req.body.pelicula }));
  });
  it("Get all Showtimes", async () => {
    const mockShowtime1 = {
      _id: "testShowtimeId1",
      ...req.body 
    };
    const mockShowtime2 = {
      _id: "testShowtimeId2",
      ...req.body 
    };
    const mockShowtimes = [mockShowtime1, mockShowtime2];
    (showtimeService.getAllShowtimes as jest.Mock).mockResolvedValue(mockShowtimes);

    await showtimeController.getAllShowtimes(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockShowtimes);
  }); 
  it("Get Showtime by ID", async () => {
    req.params = { id: "validId" };

    const mockShowtime = { _id: "validId", pelicula: "peliculaId" };
    (showtimeService.getShowtimeById as jest.Mock).mockResolvedValue(mockShowtime);

    await showtimeController.getShowtimeById(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockShowtime);
  });
  it("Get Showtime by ID - Not Found", async () => {
    req.params = { id: "invalidId" };
    (showtimeService.getShowtimeById as jest.Mock).mockResolvedValue(null);

    await showtimeController.getShowtimeById(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Función no encontrada" });
  });
  it("Delete Showtime", async () => {
    req.params = { id: "deleteId" };

    const mockShowtime = { _id: "deleteId" };
    (showtimeService.getShowtimeById as jest.Mock).mockResolvedValue(mockShowtime);
    (showtimeService.deleteShowtime as jest.Mock).mockResolvedValue(mockShowtime);

    await showtimeController.deleteShowtime(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockShowtime);
  });
  it("Delete Showtime - Not Found", async () => {
    req.params = { id: "invalidId" };
    (showtimeService.getShowtimeById as jest.Mock).mockResolvedValue(null);

    await showtimeController.deleteShowtime(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Función no encontrada" });
  });
  it("Update Showtime", async () => {
    req.params = { id: "updateId" };
    req.body = { precio: 25000 };

    const updatedShowtime = { _id: "updateId", precio: 25000 };
    (showtimeService.updateShowtime as jest.Mock).mockResolvedValue(updatedShowtime);

    await showtimeController.updateShowtime(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(updatedShowtime);
  });
  it("Update Showtime Not found", async () => {
    req.params = { id: "invalidId" };
    (showtimeService.updateShowtime as jest.Mock).mockResolvedValue(null);

    await showtimeController.updateShowtime(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Función no encontrada" });
  });
});

