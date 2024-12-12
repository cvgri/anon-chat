const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let users = {};
let anonimId = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');

  // Anonim kullanıcı adı oluştur
  const anonimName = `Anonim ${anonimId++}`;
  users[socket.id] = anonimName;

  // Kullanıcıya anonim kullanıcı adını gönder
  socket.emit('anonimName', anonimName);

  // Sohbet odasına mesaj gönder
  socket.on('message', (message) => {
    io.emit('message', { name: users[socket.id], message });
  });

  // Kullanıcı sohbet odasından ayrıldığında
  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});
