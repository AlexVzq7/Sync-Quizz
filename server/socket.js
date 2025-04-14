import { getRandomQuestion } from './questions';

const rooms = {};

export default (io) => {
  io.on('connection', (socket) => {
    console.log(`Nouvelle connexion : ${socket.id}`);

    socket.on('join_room', (roomID) => {
      socket.join(roomID);
      rooms[roomID] = rooms[roomID] || [];
      rooms[roomID].push(socket.id);

      console.log(`Joueur ${socket.id} a rejoint la salle ${roomID}`);

      if (rooms[roomID].length === 2) {
        const question = getRandomQuestion();
        io.to(roomID).emit('start_game', {
          question,
          timer: 30
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Déconnexion : ${socket.id}`);
      for (const room in rooms) {
        rooms[room] = rooms[room].filter(id => id !== socket.id);
        if (rooms[room].length === 0) {
          delete rooms[room];
        }
      }
    });
  });
};
