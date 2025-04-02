import {showtimeService, movieService}  from '../../../src/services';
import {ShowtimeInput, Movie, MovieInput} from '../../../src/models';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Showtime, ShowtimeDocument, ShowtimeState } from '../../../src/models/showtime.model';

let mongoServer: MongoMemoryServer;

jest.mock('../../src/models/showtime.model');

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
describe('ShowtimeService', () => {
  it('Create Showtime', async () => {
    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Pelicula de Prueba',
      genero: 'Acción',
      director: 'Director Test',
      duracion: 120,
      descripcion: 'Descripción de prueba',
      idioma: 'Español',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });

    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);
    jest.spyOn(Showtime.prototype, 'save').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible'
    });

    const mockShowtimeInput = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible' as ShowtimeState
    };

    const result = await showtimeService.createShowtime(mockShowtimeInput);

    expect(result).toBeDefined();
    expect(result.pelicula).toEqual(mockMovie._id);
    expect(result.precio).toBe(15000);
    expect(result.disponibilidad).toBe(50);
    expect(result.estado).toBe('Disponible');
  });
  // it('Create Showtime without mocking', async () => {
  //   const movieInput:MovieInput = {
  //     titulo: 'Apoporis',
  //     genero: 'Documental',
  //     director: 'Director Test',
  //     duracion: 186,
  //     descripcion: 'Cascadas y arboles',
  //     idioma: 'Español',
  //     estado: 'Proximamente',
  //     clasificacion: 'PG-13'
  //   };
  //   const movie = await movieService.createMovie(movieInput);

  //   const showtimeInput:ShowtimeInput = {
  //     pelicula: movie._id as mongoose.Types.ObjectId,
  //     fechaHora: new Date(),
  //     precio: 20000,
  //     disponibilidad: 100,
  //     estado: 'Disponible' as ShowtimeState
  //   };
  //   const showtime = await showtimeService.createShowtime(showtimeInput);

  //   expect(showtime).toBeDefined();
  //   expect(showtime.disponibilidad).toBe(100);
  //   expect(showtime.estado).toBe('Disponible');

  // });
  it('Create Showtime 2', async () => {
    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Titanic',
      genero: 'Drama',
      director: 'Director Test',
      duracion: 166,
      descripcion: 'Barco hace blub blub blub',
      idioma: 'English',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });

    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);
    jest.spyOn(Showtime.prototype, 'save').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 20000,
      disponibilidad: 100,
      estado: 'Disponible'
    });

    const mockShowtimeInput = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: 20000,
      disponibilidad: 100,
      estado: 'Disponible' as ShowtimeState
    };

    const result = await showtimeService.createShowtime(mockShowtimeInput);
    expect(result).toBeDefined();
    expect(result.pelicula).toEqual(mockMovie._id);
    expect(result.precio).toBe(20000);
    expect(result.disponibilidad).toBe(100);
    expect(result.estado).toBe('Disponible');
  });
  it('Create with invalid price', async () => {
    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Titanic',
      genero: 'Drama',
      director: 'Director Test',
      duracion: 166,
      descripcion: 'Barco hace blub blub blub',
      idioma: 'English',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });

    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);
    jest.spyOn(Showtime.prototype, 'save').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: -10000,
      disponibilidad: 100,
      estado: 'Disponible'
    });

    const mockShowtimeInput = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: -10000,
      disponibilidad: 100,
      estado: 'Disponible' as ShowtimeState
    };

    await expect(showtimeService.createShowtime(mockShowtimeInput)).rejects.toThrow("Precio no válido");
  });
  it('Create with Price = 0', async () => {
    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Titanic',
      genero: 'Drama',
      director: 'Director Test',
      duracion: 166,
      descripcion: 'Barco hace blub blub blub',
      idioma: 'English',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });

    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);
    jest.spyOn(Showtime.prototype, 'save').mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 0,
      disponibilidad: 60,
      estado: 'Disponible'
    });

    const mockShowtimeInput = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: 0,
      disponibilidad: 100,
      estado: 'Disponible' as ShowtimeState
    };
    const result = await showtimeService.createShowtime(mockShowtimeInput);
    expect(result).toBeDefined();
    expect(result.pelicula).toEqual(mockMovie._id);
    expect(result.precio).toBe(0);
    expect(result.disponibilidad).toBe(60);
    expect(result.estado).toBe('Disponible');
  });
  it('Movie does not exist', async () => {
    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(null);

    const mockShowtimeInput = {
      pelicula: new mongoose.Types.ObjectId(),
      fechaHora: new Date(),
      precio: 0,
      disponibilidad: 100,
      estado: 'Disponible' as ShowtimeState
    };
    await expect(showtimeService.createShowtime(mockShowtimeInput))
    .rejects.toThrow("Película no encontrada");
  });
  it('Update Showtime Increment price', async () => {

    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Pelicula de Prueba',
      genero: 'Acción',
      director: 'Director Test',
      duracion: 120,
      descripcion: 'Descripción de prueba',
      idioma: 'Español',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });
    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);


    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible'
    };
  
    jest.spyOn(Showtime, 'findByIdAndUpdate').mockResolvedValue({
      ...mockShowtime,
      precio: 20000 // Nuevo precio
    });
  
    const result = await showtimeService.updateShowtime(mockShowtime._id.toString(), {
      precio: 20000,
      pelicula: mockShowtime.pelicula as mongoose.Types.ObjectId,
      fechaHora: mockShowtime.fechaHora,
      disponibilidad: 50,
      estado: 'Disponible'
    });
  
    expect(result).toBeDefined();
    expect(result?.precio).toBe(20000);
    expect(result?.disponibilidad).toBe(50);
  });
  it('Update Showtime decrement price', async () => {

    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Pelicula de Prueba',
      genero: 'Acción',
      director: 'Director Test',
      duracion: 120,
      descripcion: 'Descripción de prueba',
      idioma: 'Español',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });
    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);

    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible'
    };
  
    jest.spyOn(Showtime, 'findByIdAndUpdate').mockResolvedValue({
      ...mockShowtime,
      precio: 10000
    });
  
    const result = await showtimeService.updateShowtime(mockShowtime._id.toString(), {
      precio: 10000,
      pelicula: mockShowtime.pelicula as mongoose.Types.ObjectId,
      fechaHora: mockShowtime.fechaHora,
      disponibilidad: 50,
      estado: 'Disponible'
    });
  
    expect(result).toBeDefined();
    expect(result?.precio).toBe(10000);
    expect(result?.disponibilidad).toBe(50);
  });
  it('Invalid Update with negative price', async () => {

    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Pelicula de Prueba',
      genero: 'Acción',
      director: 'Director Test',
      duracion: 120,
      descripcion: 'Descripción de prueba',
      idioma: 'Español',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });
    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);


    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible'
    };
    const mockUpdatedShowtime = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: -1000,
      disponibilidad: 50,
      estado: mockShowtime.estado as ShowtimeState
    };
  
    await expect(showtimeService.updateShowtime(mockShowtime._id.toString(),mockUpdatedShowtime)).rejects.toThrow("Precio no válido");
  });
  it('Valid Update with price = 0', async () => {

    const mockMovie = new Movie({
      _id: new mongoose.Types.ObjectId(),
      titulo: 'Pelicula de Prueba',
      genero: 'Acción',
      director: 'Director Test',
      duracion: 120,
      descripcion: 'Descripción de prueba',
      idioma: 'Español',
      estado: 'Disponible',
      clasificacion: 'PG-13'
    });
    jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);


    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: mockMovie._id,
      fechaHora: new Date(),
      precio: 5000,
      disponibilidad: 50,
      estado: 'Disponible'
    };
    const mockUpdatedShowtime = {
      pelicula: mockMovie._id as mongoose.Types.ObjectId,
      fechaHora: new Date(),
      precio: 0,
      disponibilidad: 50,
      estado: mockShowtime.estado as ShowtimeState
    };

    jest.spyOn(Showtime, 'findByIdAndUpdate').mockResolvedValue({
      ...mockShowtime,
      precio: 0
    });

    const result = await showtimeService.updateShowtime(mockShowtime._id.toString(),mockUpdatedShowtime);
  
    expect(result).toBeDefined();
    expect(result?.precio).toBe(0);
    expect(result?.disponibilidad).toBe(50);
  });
  it('Delete Showtime', async () => {
    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: new mongoose.Types.ObjectId(),
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible'
    };
  
    jest.spyOn(Showtime, 'findByIdAndDelete').mockResolvedValue(mockShowtime as ShowtimeDocument);
    jest.spyOn(Showtime, 'findById').mockResolvedValue(null);
  
    const result = await showtimeService.deleteShowtime(mockShowtime._id.toString());
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result!._id).toEqual(mockShowtime._id);
  });
  it('Search deleted Showtime', async () => {
    const mockShowtime = {
      _id: new mongoose.Types.ObjectId(),
      pelicula: new mongoose.Types.ObjectId(),
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: 'Disponible',
      populate: jest.fn().mockResolvedValue(null) // Simula la llamada a populate()
    };

    jest.spyOn(Showtime, 'findByIdAndDelete').mockResolvedValue(mockShowtime as any);
    jest.spyOn(Showtime, 'findById').mockReturnValue({
      populate: jest.fn().mockResolvedValue(null) // Simula que la consulta no devuelve nada
    } as any);

    const result = await showtimeService.deleteShowtime(mockShowtime._id.toString());
    
    const search = await showtimeService.getShowtimeById(mockShowtime._id.toString());

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    
    expect(search).toBeNull();
  });
});
