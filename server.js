const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 3000;
const { Server } = require('socket.io');
const io = new Server(http);

const { WebcastPushConnection } = require('tiktok-live-connector');

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Username of someone who is currently live
  let tiktokUsername = 'ayhiefachcrie';

  // Create a new wrapper object and pass the username
  let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

  // Connect to the chat (await can be used as well)
  tiktokLiveConnection
    .connect()
    .then((state) => {
      console.info(`Connected to roomId ${state.roomId}`);
      io.emit('handle audio', 'connected');
    })
    .catch((err) => {
      console.error('Failed to connect');
      io.emit('handle audio', 'error');
    });

  // Define the events that you want to handle
  // In this case we listen to chat messages (comments)
  tiktokLiveConnection.on('chat', (data) => {
    // console.log(
    //   `${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`
    // );
    // io.emit('handle audio', data);
  });

  // And here we receive gifts sent to the streamer
  tiktokLiveConnection.on('gift', (data) => {
    // console.log(
    //   `${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`
    // );
    if (data.repeatEnd) {
      let countCoins = data.diamondCount * data.repeatCount;

      // ganti tulisan
      io.emit(
        'handle audio',
        `Thank you ${data.uniqueId} send ${countCoins} coin ${data.giftName}`
      );
    }
    // io.emit('handle audio', data);
  });
});
// app.get('/', (req, res) => {
// });

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
