const socket = io();

const audio = $('#audio');

// class EventEmitter {
//   constructor(n) {
//     this.name = n;
//     this.audio = document.getElementById('audio');
//   }
//   on() {
//     this.audio.play();
//   }
//   emit() {
//     this.on();
//   }
// }

// const testClass = new EventEmitter();

socket.on('connect', () => console.log('connected'));
const queue = [];

socket.on('handle audio', function (text) {
  // console.log($('audio').get(0).paused);

  // audio.attr('src', `http://localhost:8668/?text=${queue[0]}`);
  // audio.get(0).play();
  // queue.shift();
  handleAudio(text, false);
});

function handleAudio(text, isHandleEnded) {
  if (queue.length > 0) return;
  if (isHandleEnded == false) {
    queue.push(text);
  }
  console.log('before', queue);
  if (audio.get(0).paused && queue.length > 0) {
    audio.attr('src', `http://localhost:8668/?text=${queue[0]}`);
    audio.get(0).play();
    queue.shift();
  }
  console.log('after', queue);
}

document.getElementById('audio').addEventListener('ended', function () {
  if (queue.length > 0) {
    handleAudio('', true);
    return;
  }
  audio.get(0).pause();
});
// audio.ended(function () {
//   handleAudio('', true);
// });

// window.addEventListener('mousemove', function (e) {
//   audio.play();
// });

async function playAudio(audio) {
  try {
    await audio.play();
  } catch (err) {
    console.log(err);
  }
}
