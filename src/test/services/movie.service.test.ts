import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Movie, MovieState } from "../../../src/models/movie.model";
import { movieService } from "../../../src/services";

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

describe("Movie Service", () => {
  it("debería crear una película", async () => {
    const movieInput = {
      titulo: "Inception",
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 148,
      descripcion: "A mind-bending thriller",
      idioma: "English",
      estado: "Estreno" as MovieState,
      clasificacion: "PG-13",
    };

    const movie = await movieService.createMovie(movieInput);

    expect(movie).toBeDefined();
    expect(movie.titulo).toBe("Inception");
    expect(movie.director).toBe("Christopher Nolan");

    const movieInDb = await Movie.findOne({ titulo: "Inception" });
    expect(movieInDb).not.toBeNull();
    expect(movieInDb?.titulo).toBe("Inception");
  });

  it("debería encontrar una película por ID", async () => {
    const movie = await Movie.create({
      titulo: "Interstellar",
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 169,
      descripcion: "Exploring space and time",
      idioma: "English",
      estado: "Cartelera",
      clasificacion: "PG-13",
    });

    const foundMovie = await movieService.getMovieByTitle(movie.titulo);

    expect(foundMovie).toBeDefined();
    expect(foundMovie?.titulo).toBe("Interstellar");
  });

  it("debería actualizar una película", async () => {
    const movie = await Movie.create({
      titulo: "Dunkirk",
      genero: "War",
      director: "Christopher Nolan",
      duracion: 106,
      descripcion: "A WWII epic",
      idioma: "English",
      estado: "Cartelera",
      clasificacion: "PG-13",
    });

    const updatedMovie = await movieService.updateMovie(movie.titulo, {
      titulo: "Dunkirk Updated",
      genero: "War",
      director: "Christopher Nolan",
      duracion: 106,
      descripcion: "A WWII epic",
      idioma: "English",
      estado: "Fuera de Cartelera",
      clasificacion: "PG-13",
    });

    expect(updatedMovie).toBeDefined();
    expect(updatedMovie?.titulo).toBe("Dunkirk Updated");

    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb?.titulo).toBe("Dunkirk Updated");
  });

  it("debería eliminar una película", async () => {
    const movie = await Movie.create({
      titulo: "Tenet",
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 150,
      descripcion: "A time-bending thriller",
      idioma: "English",
      estado: "Estreno",
      clasificacion: "PG-13",
    });

    const deletedMovie = await movieService.deleteMovie(movie.titulo);

    expect(deletedMovie).toBeDefined();
    expect(deletedMovie?.titulo).toBe("Tenet");

    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb).toBeNull();
  });

  it("debería devolver null si la película no existe", async () => {
    const movie = await movieService.deleteMovie(new mongoose.Types.ObjectId().toString());

    expect(movie).toBeNull();
  });
});