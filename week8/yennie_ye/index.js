const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', async function(req, res){
  res.json(await messageModel.find());
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  socket.on('chat message', async (data) => {
    const msg = new messageModel({ name: data.name, text: data.text });
    await msg.save(); // 保存到 MongoDB
    io.emit('chat message', data); // 广播给所有人
  });

  socket.on('typing', (msg) => {
    socket.broadcast.emit('typing', msg);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

const messageSchema = new mongoose.Schema({
  name: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const messageModel = mongoose.model('Message', messageSchema);

