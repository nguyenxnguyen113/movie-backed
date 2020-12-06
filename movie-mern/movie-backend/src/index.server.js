const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");

const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
// const initialDataRoutes = require("./routes/admin/intitialData");
const cors = require('cors');


const app = express();

mongoose
  .connect("mongodb+srv://admin:admin@cluster0.uyq8v.mongodb.net/movie-mern?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected");
  });
env.config();
app.use(express.json());

app.use(cors())
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
// app.use("/api", initialDataRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running on PORT: ${process.env.PORT}`);
});
