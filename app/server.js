const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const url =
  "mongodb+srv://tsurowtihomir:Tishko123456@cluster0.1x2o3uq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

io.on("connection", async (socket) => {
  await client.connect();
  const db = client.db("buttonState");
  const collection = db.collection("state");
  collection.findOne({}, (err, result) => {
    if (err) {
      console.error("Error retrieving button state from MongoDB:", err);
      return;
    }
    const buttonState = result ? result.state : false;
    socket.emit("buttonStateChange", buttonState);
  });

  socket.on("buttonStateChange", async (state) => {
    collection.updateOne({}, { $set: { state } }, { upsert: true }, (err) => {
      if (err) {
        console.error("Error updating button state in MongoDB:", err);
        return;
      }
      io.emit("buttonStateChange", state);
    });
  });
  const changeStream = collection.watch({ fullDocument: "updateLookup" });
  changeStream.on("change", (change) => {
    if (change.fullDocument) {
      const buttonState = change.fullDocument.state;
      io.emit("buttonStateChange", buttonState);
    } else {
      console.log("Change event does not include full document");
    }
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
