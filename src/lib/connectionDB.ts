import mongoose from "mongoose";


const connectionString: string =
  "mongodb+srv://josealejandromc4:alejandroM0@cluster0.79oifrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const db =mongoose.connect(connectionString,{dbName: "CineDB"}).then(()=>{
    console.log("Conexión exitosa a la base de datos");
});

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Conexión a la base de datos cerrada");
  } catch (error) {
    console.error("Error al cerrar la conexión a la base de datos", error);
    throw error;
  }
};
