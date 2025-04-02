import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Showtime } from "../../../src/models/showtime.model"; // Ajusta la ruta según tu estructura

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Showtime Model", () => {
  it("Debe crear un Showtime válido", async () => {
        const showtime = new Showtime({
        pelicula: new mongoose.Types.ObjectId(),
        fechaHora: new Date(),
        precio: 20000,
        disponibilidad: 100,
        estado: "Disponible",
        });

        const savedShowtime = await showtime.save();
        expect(savedShowtime._id).toBeDefined();
        expect(savedShowtime.estado).toBe("Disponible");
  });

  it("Debe fallar si falta el campo 'pelicula'", async () => {
        const showtime = new Showtime({
        fechaHora: new Date(),
        precio: 20000,
        disponibilidad: 100,
        estado: "Disponible",
        });

        await expect(showtime.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("Debe fallar si el estado no es válido", async () => {
    const showtime = new Showtime({
      pelicula: new mongoose.Types.ObjectId(),
      fechaHora: new Date(),
      precio: 20000,
      disponibilidad: 100,
      estado: "Invalido",
    });

    await expect(showtime.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("Debe permitir la referencia a una 'Pelicula' válida", async () => {
    const peliculaId = new mongoose.Types.ObjectId();
    const showtime = new Showtime({
      pelicula: peliculaId,
      fechaHora: new Date(),
      precio: 15000,
      disponibilidad: 50,
      estado: "Agotado",
    });

    const savedShowtime = await showtime.save();
    expect(savedShowtime.pelicula.toString()).toBe(peliculaId.toString());
  });
  describe("Showtime Model - Casos adicionales", () => {
    it("Debe fallar si 'fechaHora' es una fecha inválida", async () => {
      const showtime = new Showtime({
        pelicula: new mongoose.Types.ObjectId(),
        fechaHora: "FechaNoValida",
        precio: 25000,
        disponibilidad: 100,
        estado: "Disponible",
      });
  
      await expect(showtime.save()).rejects.toThrow();
    });
  
    it("Debe fallar si 'precio' es menor que 0", async () => {
        const showtime = new Showtime({
          pelicula: new mongoose.Types.ObjectId(),
          fechaHora: new Date(),
          precio: -1000,
          disponibilidad: 50,
          estado: "Disponible",
        });
      
        try {
          await showtime.save();
        } catch (error) {
            const validationError = error as mongoose.Error.ValidationError;
            expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(validationError.errors["precio"].message).toBe("El precio no puede ser negativo");
        }
    });
  
    it("Debe fallar si 'disponibilidad' es menor que 0", async () => {
        const showtime = new Showtime({
          pelicula: new mongoose.Types.ObjectId(),
          fechaHora: new Date(),
          precio: 18000,
          disponibilidad: -5, // ❌ No puede ser negativo
          estado: "Agotado",
        });
      
        try {
          await showtime.save();
        } catch (error) {
            const validationError = error as mongoose.Error.ValidationError;
            expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(validationError.errors["disponibilidad"].message).toBe("La disponibilidad no puede ser negativa");
        }
    });
  
    it("Debe aceptar 'disponibilidad' en 0", async () => {
      const showtime = new Showtime({
        pelicula: new mongoose.Types.ObjectId(),
        fechaHora: new Date(),
        precio: 18000,
        disponibilidad: 0,
        estado: "Agotado",
      });
  
      const savedShowtime = await showtime.save();
      expect(savedShowtime.disponibilidad).toBe(0);
    });
  
    it("Debe crear un 'Showtime' con valores en los límites permitidos", async () => {
      const showtime = new Showtime({
        pelicula: new mongoose.Types.ObjectId(),
        fechaHora: new Date("2030-01-01T00:00:00Z"), 
        precio: 50000, 
        disponibilidad: 500, 
        estado: "Disponible",
      });
  
      const savedShowtime = await showtime.save();
      expect(savedShowtime.precio).toBe(50000);
      expect(savedShowtime.disponibilidad).toBe(500);
      expect(savedShowtime.fechaHora.toISOString()).toBe("2030-01-01T00:00:00.000Z");
    });
  });
  
});
