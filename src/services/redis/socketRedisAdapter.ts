import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import { RedisConn } from './redis.index';
import config from '../../config/config';

const baseRedisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;

// For socket.io-redis-adapter, we need both pub & sub clients
const pubClient = baseRedisClient;
const subClient = pubClient.duplicate(); // ioredis built-in

export async function attachRedisAdapter(io: Server) {
  try {
    // No need for `.connect()` with ioredis — it connects automatically
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Redis adapter attached to Socket.IO');
  } catch (err) {
    console.error("❌ Failed to attach Redis adapter:", err);
  }
}
