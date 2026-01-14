import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import UserRoute from "./Routes/UserRoute.js";
import AuthRoute from "./Routes/AuthRoute.js";
import WargaRoute from "./Routes/WargaRoute.js";
import TransaksiRoute from "./Routes/TransaksiRoute.js";

dotenv.config();
const app = express();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://192.168.100.7:8081",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(fileUpload());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static("public/images"));

app.use(UserRoute);
app.use(AuthRoute);
app.use(WargaRoute);
app.use(TransaksiRoute);



app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
