import { KafkaService } from "../config/kafkaConnection";
import { kafkaEvents } from "../config/kafkaEvent";
import { driverMatch } from "../services/driverMatch/driverMatchService";
import { socketEvents } from "../config/socketEvents";
import { Emitter } from '@socket.io/redis-emitter';
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";

const KAFKA_PORT = process.env.KAFKA_HOST || "localhost:9092";
const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;
const kafka = new KafkaService([KAFKA_PORT], kafkaEvents.clientId);
const emitter = new Emitter(redisClient);

const sendToKafka = async ({ topic, partition, msg }: { topic: string, partition: number, msg: any }) => {
  await kafka.connectProducer();
  await kafka.sendMessage(topic, partition, msg);
};





const handleAvailableDriver =async (driver: any)=>{
   // some  driver logic alogorithm or something 
   return  driver
}

setTimeout(async () => {
  await kafka.createConsumer(
    kafkaEvents.consumerGroups.CAB_BOOKING.GRP1,
    kafkaEvents.topic.CAB_BOOKING,
    async (msg) => {
      try {
        const { correlationId, user } = JSON.parse(msg);
        let foundDriver = {driver:"ok"}
      
          // await kafka.createConsumer(
          //   kafkaEvents.consumerGroups.AVAILABLE_DRIVER.GRP1,
          //   kafkaEvents.topic.AVAILABLE_DRIVERS,
          //   async (availalableDriverDetails) => {
          //     console.log("Received driver:>>", availalableDriverDetails);
          //     foundDriver = availalableDriverDetails;

          //     // You can also call a function here
          //     await handleAvailableDriver(availalableDriverDetails);
          //   }
          // );

        console.log(foundDriver)
        
        await sendToKafka({
          topic: kafkaEvents.topic.CAB_BOOKED,
          partition: 0,
          msg: [JSON.stringify(foundDriver)],
        });

        const socketId = await redisClient.get(correlationId);
        if (socketId) {
          setTimeout(() => {
            emitter.to(socketId).emit(socketEvents.CAB_BOOKED, foundDriver);
            console.log(`Emit successful to socket ID ${socketId}`);
          }, 4000);
        }

        console.log("user>>", user, correlationId, socketId);
      } catch (err) {
        console.error('Kafka CAB_BOOKING error:', err);
      }
    }
  );
}, 1000);
