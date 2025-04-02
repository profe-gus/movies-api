import mongoose, { Document, Schema } from "mongoose";
import { MovieDocument } from "./movie.model";

export type ShowtimeState = "Disponible" | "Agotado" | "Cancelado";

export interface ShowtimeInput {
  pelicula: mongoose.Types.ObjectId | MovieDocument;
  fechaHora: Date;
  precio: number;
  disponibilidad: number;
  estado: ShowtimeState;
}

export interface ShowtimeDocument extends Document, ShowtimeInput {}

const ShowtimeSchema = new Schema<ShowtimeDocument>(
  {
    pelicula: { type: Schema.Types.ObjectId, ref: "Pelicula", required: true },
    fechaHora: { type: Date, required: true },
    precio: { type: Number, required: true, min: [0, "El precio no puede ser negativo"] },
    disponibilidad: { type: Number, required: true, min: [0, "La disponibilidad no puede ser negativa"]  },
    estado: { type: String, required: true, enum: ["Disponible", "Agotado", "Cancelado"] },
  },
  { timestamps: true }
);

export const Showtime = mongoose.model<ShowtimeDocument>("Showtime", ShowtimeSchema);
