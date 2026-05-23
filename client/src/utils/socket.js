import { io } from "socket.io-client";

const socket = io("https://api.inabazar.com");

export default socket;
