import { Showtime, ShowtimeDocument, ShowtimeInput } from '../models/showtime.model';
import { movieService } from "./movie.service";

class ShowtimeService {
  async createShowtime(data: ShowtimeInput): Promise<ShowtimeDocument> {
    const movie = await movieService.getMovieById(data.pelicula as unknown as string);
    if (!movie) {
      throw new Error("Película no encontrada");
    }
    if(data.precio<0){
      throw new Error("Precio no válido");
    }
    const nuevoShowtime = new Showtime({
      pelicula: movie._id,
      fechaHora: data.fechaHora,
      precio: data.precio,
      disponibilidad: data.disponibilidad,
      estado: data.estado
    });
    return await nuevoShowtime.save();
  }

  async getAllShowtimes(): Promise<ShowtimeDocument[]> {
    return await Showtime.find().populate("pelicula");
  }
  async getShowtimeById(id: string): Promise<ShowtimeDocument | null> {
    return await Showtime.findById(id).populate("pelicula"); // Ahora pasamos solo el ID
  }
  async deleteShowtime(id: string): Promise<ShowtimeDocument | null>{
    return await Showtime.findByIdAndDelete(id);
  }
  async updateShowtime(id: string, data:ShowtimeInput): Promise<ShowtimeDocument | null>{
    const movie = await movieService.getMovieById(data.pelicula as unknown as string);
    
    if (!movie) {
      throw new Error("Película no encontrada");
    }
    if(data.precio<0){
      throw new Error("Precio no válido");
    }

    return await Showtime.findByIdAndUpdate(
      id,
      {
        pelicula: movie._id,
        fechaHora: data.fechaHora,
        precio: data.precio,
        disponibilidad: data.disponibilidad,
        estado: data.estado
      },
      { new: true }
    );
  }
}

export const showtimeService = new ShowtimeService();
