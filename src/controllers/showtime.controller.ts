import { Request, Response } from "express";
import { showtimeService } from "../services/showtime.service";

class ShowtimeController {
    async createShowtime(req: Request, res: Response) {
        try {
          const showtime = await showtimeService.createShowtime(req.body);
          res.status(201).json(showtime);
        } catch (error: any) {
          res.status(400).json({ error: error.message });
        }
    }

    async getAllShowtimes(req: Request, res: Response) {
        try {
            const showtimes = await showtimeService.getAllShowtimes();
            res.status(200).json(showtimes);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las funciones", error });
        }
    }
    async getShowtimeById(req: Request, res: Response) {
        try {
            const  {id}  = req.params;
            const showtime = await showtimeService.getShowtimeById(id);
            // const showtimes = await showtimeService.getAllShowtimes();
            if(!showtime){
                res.status(404).json({ message: "Función no encontrada" });
            }
            res.status(200).json(showtime);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las funciones", error });
        }
    }
    async deleteShowtime(req: Request, res: Response) {
        try {
            const  {id}  = req.params;
            const showtime = await showtimeService.getShowtimeById(id);
            if(!showtime){
                res.status(404).json({ message: "Función no encontrada" });
            }
            showtimeService.deleteShowtime(id);
            res.status(200).json(showtime);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las funciones", error });
        }
    }
    async updateShowtime(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const showtime = await showtimeService.updateShowtime(id,req.body);
            if(!showtime){
                res.status(404).json({ message: "Función no encontrada" });
            }
            res.status(201).json(showtime);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la función", error });
        }
    }
    
    
}

export const showtimeController = new ShowtimeController();
