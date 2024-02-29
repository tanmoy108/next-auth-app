import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.DB);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("db connected");
    });
    connection.on("error", (err) => {
      console.log("error", err);
      process.exit();
    });
  } catch (error) {
    console.log("some error on connection in DB", error);
  }
}
