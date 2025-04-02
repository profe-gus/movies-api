import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Request, Response } from "express";
import { Movie } from "../../../src/models/movie.model";
import { movieController } from "../../../src/controllers/movie.controller";

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

describe("Movie Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("createMovie", () => {
    it("debería crear una película", async () => {
      req.body = {
        titulo: "Inception",
        genero: "Sci-Fi",
        director: "Christopher Nolan",
        duracion: 148,
        descripcion: "A mind-bending thriller",
        idioma: "English",
        estado: "Estreno",
        clasificacion: "PG-13",
      };
      const next = jest.fn();
      await movieController.createMovie(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: "Inception" })
      );

      const movieInDb = await Movie.findOne({ titulo: "Inception" });
      expect(movieInDb).not.toBeNull();
      expect(movieInDb?.titulo).toBe("Inception");
    });

    it("debería devolver un error si la película ya existe", async () => {
      await Movie.create({
        titulo: "Inception",
        genero: "Sci-Fi",
        director: "Christopher Nolan",
        duracion: 148,
        descripcion: "A mind-bending thriller",
        idioma: "English",
        estado: "Estreno",
        clasificacion: "PG-13",
      });

      req.body = {
        titulo: "Inception",
        genero: "Sci-Fi",
        director: "Christopher Nolan",
        duracion: 148,
        descripcion: "A mind-bending thriller",
        idioma: "English",
        estado: "Estreno",
        clasificacion: "PG-13",
      };
      const next = jest.fn();
      await movieController.createMovie(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "La pelicula con titulo Inception ya existe",
      });
    });
  });

  describe("getAllMovies", () => {
    it("debería devolver todas las películas", async () => {
      await Movie.create([
        {
          titulo: "Inception",
          genero: "Sci-Fi",
          director: "Christopher Nolan",
          duracion: 148,
          descripcion: "A mind-bending thriller",
          idioma: "English",
          estado: "Estreno",
          clasificacion: "PG-13",
        },
        {
          titulo: "Interstellar",
          genero: "Sci-Fi",
          director: "Christopher Nolan",
          duracion: 169,
          descripcion: "Exploring space and time",
          idioma: "English",
          estado: "Cartelera",
          clasificacion: "PG-13",
        },
      ]);

      const next = jest.fn();
      await movieController.getAllMovies(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ titulo: "Inception" }),
          expect.objectContaining({ titulo: "Interstellar" }),
        ])
      );
    });
  });

  describe("getMovieByTitle", () => {
    it("debería devolver una película por título", async () => {
      await Movie.create({
        titulo: "Inception",
        genero: "Sci-Fi",
        director: "Christopher Nolan",
        duracion: 148,
        descripcion: "A mind-bending thriller",
        idioma: "English",
        estado: "Estreno",
        clasificacion: "PG-13",
      });

      req.params = { titulo: "Inception" };
      const next = jest.fn();
      await movieController.getMovieByTitle(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: "Inception" })
      );
    });

    it("debería devolver 404 si la película no existe", async () => {
      req.params = { titulo: "Nonexistent Movie" };
      const next = jest.fn();
      await movieController.getMovieByTitle(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "La pelicula Nonexistent Movie no fue encontrado",
      });
    });
  });

  describe("updateMovie", () => {
    it("debería actualizar una película", async () => {
      const movie = await Movie.create({
        titulo: "Inception",
        genero: "Sci-Fi",
        director: "Christopher Nolan",
        duracion: 148,
        descripcion: "A mind-bending thriller",
        idioma: "English",
        estado: "Estreno",
        clasificacion: "PG-13",
      });

      req.params = { titulo: "Inception" };
      req.body = { titulo: "Inception Updated" };
      const next = jest.fn();
      await movieController.updateMovie(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: "Inception Updated" })
      );

      const updatedMovie = await Movie.findOne({ titulo: "Inception Updated" });
      expect(updatedMovie).not.toBeNull();
    });

    it("debería devolver 404 si la película no existe", async () => {
      req.params = { titulo: "Nonexistent Movie" };
      req.body = { titulo: "Updated Title" };
      const next = jest.fn();
      await movieController.updateMovie(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "La pelicula Nonexistent Movie no fue encontrado",
      });
    });
    it("debería devolver 404 si la película no existe", async () => {
      // Configurar los parámetros de la solicitud
      req.params = { titulo: "Nonexistent Movie" };
      const next = jest.fn();

      // Llamar al controlador
      await movieController.deleteMovie(req as Request, res as Response, next);

      // Verificar la respuesta del controlador
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "La pelicula Nonexistent Movie no fue encontrada",
      });
    });
  });
});