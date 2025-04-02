
import { Movie, MovieDocument, MovieInput } from "../models/movie.model";

class MovieService {
  async createMovie(data: MovieInput): Promise<MovieDocument> {
    const nuevoPelicula = new Movie(data);
    return await nuevoPelicula.save();
  }

  async getAllmovies(): Promise<MovieInput[]> {
    return await Movie.find();
  }

  async getMovieByTitle(titulo: string): Promise<MovieDocument | null> {
    return await Movie.findOne({ titulo });
  }

  async getMovieById(id: string): Promise<MovieDocument | null> {
    return await Movie.findById(id);
  }

  async updateMovie(titulo: string, data: Partial<MovieInput>): Promise<MovieDocument | null> {
    return await Movie.findOneAndUpdate({ titulo }, data, { new: true });
  }

  async deleteMovie(titulo: string): Promise<MovieDocument | null> {
    return await Movie.findOneAndDelete({titulo});
  }
}

export const movieService = new MovieService();