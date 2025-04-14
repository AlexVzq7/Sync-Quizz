import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // à sécuriser pour la prod
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const rooms = {};

io.on('connection', (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on('createRoom', () => {
    const roomCode = nanoid(6).toUpperCase();
    rooms[roomCode] = {
      players: [socket.id],
      started: false,
      currentTime: 30,
      questions: [] // à remplir plus tard
    };
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
    console.log(`🎉 Room ${roomCode} created`);
  });

  socket.on('joinRoom', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    if (room.players.length >= 2) {
      socket.emit('error', 'Room is full');
      return;
    }

    room.players.push(socket.id);
    socket.join(roomCode);

    io.to(roomCode).emit('bothPlayersReady', roomCode);
    console.log(`👥 Room ${roomCode} has both players`);
  });

  socket.on('startGame', (roomCode) => {
    const room = rooms[roomCode];
    if (!room || room.started) return;

    room.started = true;

    // On pourrait charger les questions ici
    room.questions = [
      {
        question: "Capitale de l’Australie ?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
      },
      {
        question: "Combien de pattes a une araignée ?",
        answers: ["6", "8", "10", "12"],
        correct: 1
      }
    ];

    io.to(roomCode).emit('gameStarted', {
      startTime: Date.now(),
      questions: room.questions
    });

    console.log(`🕹️ Game started in room ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
    for (const [code, room] of Object.entries(rooms)) {
      room.players = room.players.filter((id) => id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[code];
        console.log(`🗑️ Room ${code} deleted (empty)`);
      }
    }
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
