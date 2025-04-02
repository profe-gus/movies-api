import mongoose, { Document } from "mongoose";

export type MovieState= "Proximamente" | "Cartelera" | "Fuera de Cartelera" | "Estreno";

export interface MovieInput {
  titulo: string;
  genero: string;
  director: string;
  duracion: number;
  descripcion: string; 
  idioma: string; 
  estado : MovieState;
  clasificacion: string;      
}

export interface MovieDocument extends Document, MovieInput {}

const MovieSchema = new mongoose.Schema<MovieDocument>(
  {
    titulo: { type: String, required: true },
    genero: { type: String, required: true },
    director: { type: String, required: true },
    duracion: { type: Number, required: true },
    descripcion: { type: String, required: true },
    idioma: { type: String, required: true },
    estado: { type: String, required: true },
    clasificacion: { type: String, required: true },
  }
);

export const Movie = mongoose.model<MovieDocument>("Pelicula", MovieSchema);