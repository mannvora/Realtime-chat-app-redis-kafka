import { Server } from "socket.io";
import { Redis } from "ioredis";


const dotenv = require('dotenv');

const redisUri = "redis://default:AVNS_ZbKAWoDpYXIUwbDMKPJ@redis-109abe5e-scalable-chat-socketio.a.aivencloud.com:13594"
const pub = new Redis(redisUri);
const sub = new Redis(redisUri);

class SocketService {
    private _io: Server;
    
    constructor() {
        console.log("Initializing Socket Service");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'], 
                origin: '*'
            }
        });

        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this._io;

        console.log("Initializing Socket Listeners");

        io.on('connect', (socket) => {
            console.log(`Socket connected: ${socket.id}`);
            
            socket.on('event:message', async ({message} : {message: string}) => {
                console.log(`Message received: ${message}`);

                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });

            // socket.on('disconnect', () => {
            //     console.log(`Socket disconnected: ${socket.id}`);
            // });
        });

        sub.on('message', (channel, message) => {
            if(channel === 'MESSAGES') {
                console.log("New message from redis", message);
                io.emit('message', message);
            }
        })
    }

    get io() {
        return this._io;
    } 
}

export default SocketService;