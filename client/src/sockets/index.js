import io from 'socket.io-client';
const socket = io.connect('', { path: '/docman/rtc' });

export default socket;
