import { io } from 'socket.io-client';

// Remplace par l'URL de ton serveur si hébergé ailleurs
const socket = io("http://localhost:3000");

export default socket;
