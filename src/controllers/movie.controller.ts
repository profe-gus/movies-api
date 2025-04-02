import { Request, Response, RequestHandler } from "express";
import { movieService } from "../services/movie.service";

class MovieController {
  createMovie: RequestHandler = async (req: Request, res: Response) => {
    try {
      const movieExiste = await movieService.getMovieByTitle(req.body.titulo);
      if (movieExiste) {
        res.status(400).json({ message: `La pelicula con titulo ${req.body.titulo} ya existe` });
        return;
      }

      const newMovie = await movieService.createMovie(req.body);
      res.status(201).json(newMovie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `La pelicula ${req.body.titulo} no pudo ser creado` });

    }
  };

  getAllMovies: RequestHandler = async (req: Request, res: Response) => {
    try {
      const movies = await movieService.getAllmovies();
      res.status(200).json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "No se pudieron obtener las peliculas" });
    }
  };

  getMovieByTitle: RequestHandler = async (req: Request, res: Response) => {
    try {
      const movie = await movieService.getMovieByTitle(req.params.titulo);
      if (!movie) {
        res.status(404).json({ message: `La pelicula ${req.params.titulo} no fue encontrado` });
        return;
      }
      res.status(200).json(movie);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `No se pudo obtener la pelicula ${req.params.movie}` });
    }
  };

  updateMovie: RequestHandler = async (req: Request, res: Response) => {
    try {
      const movieUpdate = await movieService.updateMovie(req.params.titulo, req.body);
      if (!movieUpdate) {
        res.status(404).json({ message: `La pelicula ${req.params.titulo} no fue encontrado` });
        return;
      }
      res.status(200).json(movieUpdate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `La pelicula ${req.params.titulo} no pudo ser actualizado` });
    }
  };

  deleteMovie: RequestHandler = async (req: Request, res: Response) => {
    try {
      const deletedMovie = await movieService.deleteMovie(req.params.titulo);
      if (!deletedMovie) {
        res.status(404).json({ message: `La pelicula ${req.params.titulo} no fue encontrada` });
        return;
      }
      res.status(200).json({ message: `La pelicula ${req.params.titulo} fue eliminada` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "No se pudo eliminar la pelicula" });
    }
  };
}

export const movieController = new MovieController();