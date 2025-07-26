import { KafkaService } from "./consumerInstance";
import { kafkaEvents } from "../config/kafkaEvent";
import { Emitter } from "@socket.io/redis-emitter";
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";

const uniqueClientId = `swift-cab-medium-${Math.random().toString(36).substring(7)}`;
const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9092";

const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;
const emitter = new Emitter(redisClient);

const kafka = new KafkaService({
  brokers: [KAFKA_HOST],
  clientId: uniqueClientId,
  groupId: kafkaEvents.consumerGroups.TP_AVAILABLE_DRIVERS_POOL.GRP1,
  topic: kafkaEvents.topic.TP_AVAILABLE_DRIVERS_POOL
});

async function init() {
  try {
    console.log("Connecting Kafka...");
    // await kafka.connect(); // optional if you're using internal connectConsumer
    console.log("Kafka Connected. Starting Consumer...");

    await kafka.startBatchConsumer(async (msg) => {
      try {
        const parsed = JSON.parse(msg);
        console.log("Received Kafka Message:", parsed);
      } catch (err) {
        console.error("Error parsing Kafka message:", err);
      }
    });

  } catch (err) {
    console.error("Error initializing Kafka Consumer:", err);
  }
}

init();
