module.exports = (io) => {
  // Lista de usuarios conectados
  let connectedUsers = {};

  io.on('connection', (socket) => {
    // Cuando un usuario se conecta
    socket.on('user_connected', (username) => {
      socket.username = username;
      connectedUsers[socket.id] = username;
      io.emit('users', Object.values(connectedUsers));
    });

    // Cuando un usuario se desconecta
    socket.on('disconnect', () => {
      delete connectedUsers[socket.id];
      io.emit('users', Object.values(connectedUsers));
    });
  });
};