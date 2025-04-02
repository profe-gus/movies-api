import { Router } from "express";
import { movieController } from "../controllers/movie.controller";

export const movieRouter = Router();


movieRouter.post('/movie/create', movieController.createMovie); 

movieRouter.get('/movie/get/:titulo', movieController.getMovieByTitle); 

movieRouter.get('/movies', movieController.getAllMovies);

movieRouter.put('/movie/update/:titulo', movieController.updateMovie);

movieRouter.delete('/movie/delete/:titulo', movieController.deleteMovie);

export default movieRouter;