import mongoose from "mongoose";

const dbConnect = () =>
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("DB connected successfully");
      
    })
    .catch((error) => {
      console.log(error.message);
    });
export default dbConnect