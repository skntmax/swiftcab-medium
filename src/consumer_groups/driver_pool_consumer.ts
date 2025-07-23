import { KafkaService } from "../config/kafkaConnection";
import { kafkaEvents } from "../config/kafkaEvent";
import { driverMatch } from "../services/driverMatch/driverMatchService";
import { socketEvents } from "../config/socketEvents";
import { Emitter } from '@socket.io/redis-emitter';
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";

console.log("======================ALL ENV==============", )
console.log(process.env)
console.log("======================ALL ENV==============", )

const KAFKA_PORT = process.env.KAFKA_HOST || "localhost:9092";
const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;
const kafka = new KafkaService([KAFKA_PORT], kafkaEvents.clientId);
const emitter = new Emitter(redisClient);

const sendToKafka = async ({ topic, partition, msg }: { topic: string, partition: number, msg: any }) => {
  await kafka.connectProducer();
  await kafka.sendMessage(topic, partition, msg);
};

setTimeout(async () => {
  await kafka.createConsumer(
    kafkaEvents.consumerGroups.TP_AVAILABLE_DRIVERS_POOL.GRP1,
    kafkaEvents.topic.TP_AVAILABLE_DRIVERS_POOL,
    async (msg) => {
      try {
        const parsedDriverLiveLocation = JSON.parse(msg);

        console.log("parsedDriverLiveLocation",parsedDriverLiveLocation)
      } catch (err) {
        console.error('driver pool  kafka consumer :', err);
      }
    }
  );
}, 1000);
