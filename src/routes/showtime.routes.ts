import { Router } from "express";
import { showtimeController } from "../controllers/showtime.controller"; 

const showtimeRouter = Router();

showtimeRouter.post("/showtimes", showtimeController.createShowtime);
showtimeRouter.get("/showtimes", showtimeController.getAllShowtimes);
showtimeRouter.get("/showtimes/:id", showtimeController.getShowtimeById);
showtimeRouter.delete("/showtimes/:id", showtimeController.deleteShowtime);
showtimeRouter.put("/showtimes/:id", showtimeController.updateShowtime);



// router.put("/showtimes/:id", showtimeController.updateShowtime);

export default showtimeRouter;
