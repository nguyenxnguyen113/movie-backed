const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");

const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const countryRoutes = require("./routes/country")
const actorRoutes = require("./routes/actor")
const filmError = require('./routes/filmError')
const conversation = require('./routes/conversation')
const conversationModel = require('./models/conversation')
const userModel = require('./models/user')
// const initialDataRoutes = require("./routes/admin/intitialData");
const cors = require('cors');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", countryRoutes);
app.use("/api", actorRoutes);
app.use("/api", filmError)
app.use('/api',conversation)
// app.use("/api", initialDataRoutes);
io.on('connection', (socket) => {
  socket.on("updateData", ( msg) => {
    const {senderId,isImg,content} = msg
    let conversation = new conversationModel({
        senderId:mongoose.Types.ObjectId(senderId),
        isImg:isImg,
        content:content
    })
    conversation.save(async (err,con)=>{
      if(err) console.log(err);
      else {
        let a = await userModel.find({_id:mongoose.Types.ObjectId(con.senderId)}).exec()
        delete a[0]['hash_password']
        let data = {
          content:con.content,
          isImg:con.isImg,
          sender: a
        }
        io.emit('serverSend',data)
      }
    })
  });
 });

server.listen(process.env.PORT, () => {
  console.log(`server is running on PORT: ${process.env.PORT}`);
});
