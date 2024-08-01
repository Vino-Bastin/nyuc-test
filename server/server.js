const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db/connection");
const errorHandler = require("./errors/errorHandler");

dotenv.config({
  path: ".env",
});

connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// * react static files
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/gallery", require("./routes/gallery"));

// * sending react build files
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.use(errorHandler);

app.listen(5000, () => console.log("Server is running on port 5000"));
