import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Movie } from "../../../src/models/movie.model";

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

describe("Movie Model", () => {
  it("debería guardar una película válida", async () => {
    const movieData = {
      titulo: "Inception",
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 148,
      descripcion: "A mind-bending thriller",
      idioma: "English",
      estado: "Estreno",
      clasificacion: "PG-13",
    };

    const movie = new Movie(movieData);
    const savedMovie = await movie.save();

    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.titulo).toBe(movieData.titulo);
    expect(savedMovie.genero).toBe(movieData.genero);
  });

  it("debería fallar si falta un campo requerido", async () => {
    const movieData = {
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 148,
      descripcion: "A mind-bending thriller",
      idioma: "English",
      estado: "Estreno",
      clasificacion: "PG-13",
    };

    const movie = new Movie(movieData);

    await expect(movie.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("debería permitir actualizar una película existente", async () => {
    const movieData = {
      titulo: "Interstellar",
      genero: "Sci-Fi",
      director: "Christopher Nolan",
      duracion: 169,
      descripcion: "Exploring space and time",
      idioma: "English",
      estado: "Cartelera",
      clasificacion: "PG-13",
    };

    const movie = new Movie(movieData);
    const savedMovie = await movie.save();

    savedMovie.estado = "Fuera de Cartelera";
    const updatedMovie = await savedMovie.save();

    expect(updatedMovie.estado).toBe("Fuera de Cartelera");
  });

  it("debería eliminar una película", async () => {
    const movieData = {
      titulo: "Dunkirk",
      genero: "War",
      director: "Christopher Nolan",
      duracion: 106,
      descripcion: "A WWII epic",
      idioma: "English",
      estado: "Cartelera",
      clasificacion: "PG-13",
    };

    const movie = new Movie(movieData);
    const savedMovie = await movie.save();

    await Movie.findByIdAndDelete(savedMovie._id);
    const deletedMovie = await Movie.findById(savedMovie._id);

    expect(deletedMovie).toBeNull();
  });
});