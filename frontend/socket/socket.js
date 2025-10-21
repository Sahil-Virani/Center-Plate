import { io } from 'socket.io-client';

const URL = process.env.EXPO_PUBLIC_SOCKET_URL;
console.log(URL);
export const socket = io(URL);