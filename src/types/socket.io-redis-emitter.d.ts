declare module '@socket.io/redis-emitter' {
  import { Redis } from 'ioredis';

  export class Emitter {
    constructor(redis: Redis);
    to(room: string): Emitter;
    emit(event: string, data: any): void;
  }
}
