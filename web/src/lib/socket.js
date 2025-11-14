// frontend/lib/socket.js
import { io } from 'socket.io-client';

// URL do seu servidor backend
const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Cria a instância do socket. O 'autoConnect: false' é importante para
// que possamos controlar quando a conexão é feita.
export const socket = io(URL, {
    autoConnect: false
});