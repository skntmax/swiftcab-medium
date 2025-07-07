import { KafkaService } from "../config/kafkaConnection";
import { kafkaEvents } from "../config/kafkaEvent";
import { driverMatch } from "../services/driverMatch/driverMatchService";
import { socketEvents } from "../config/socketEvents";
import { Emitter } from '@socket.io/redis-emitter';
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";

// Create Redis Client for emitter (must match socket adapter config)
const redisClient1 = (new RedisConn(config.redisConn.redisConnection1)).redisClient;

// Create Kafka consumer for cab booking
const cabBookingConsumer = new KafkaService(['localhost:9092'], kafkaEvents.clientId);

setTimeout(async () => {
  await cabBookingConsumer.createConsumer(
    kafkaEvents.consumerGroups.CAB_BOOKING.GRP1,
    kafkaEvents.topic.CAB_BOOKING,
    async (msg: any) => {
      try {
        const parsed = JSON.parse(msg);
        let socketId
        const { correlationId } = parsed;

        // const foundDriver = await driverMatch(parsed); // or mocked for now
        // console.log('Sending driver info to socket:', socketId, foundDriver);

        const emitter = new Emitter(redisClient1);
        socketId = await redisClient1.get(correlationId)
        if(socketId)
         setTimeout(()=>emitter.to(socketId).emit(socketEvents.CAB_BOOKED, {name:"drivername"}),4000 )  

        console.log(`Emit successful to socket ID ${socketId}`);
      } catch (err) {
        console.error('Error handling Kafka cab booking message:', err);
      }
    }
  );
}, 1000);
