import { io } from "socket.io-client";

const socket = io("https://api.goroabazar.com");

export default socket;
