import { KafkaService } from "./consumerInstance";
import { kafkaEvents } from "../config/kafkaEvent";
import { Emitter } from "@socket.io/redis-emitter";
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";
import { GOE_HASH_KEYS } from "../config/constant";

const uniqueClientId = `swift-cab-medium-${Math.random().toString(36).substring(7)}`;
const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9092";

const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;
const emitter = new Emitter(redisClient);

const kafka = new KafkaService({
  brokers: [KAFKA_HOST],
  clientId: uniqueClientId,
  groupId: kafkaEvents.consumerGroups.TP_DRIVER_ACCEPTED_RIDES.GRP1,
  topic: kafkaEvents.topic.TP_DRIVER_ACCEPTED_RIDES
});

async function init() {
  try {
    console.log("Connecting Kafka...");
    // await kafka.connect(); // optional
    console.log("Kafka Connected. Starting Consumer...");

    await kafka.startBatchConsumer(async (msg: string) => {
      try {
        const rideDetailsWithCustomerDriverObject = JSON.parse(msg);  // Parse Kafka message

        console.log("rideDetailsWithCustomerDriverObject>>", rideDetailsWithCustomerDriverObject)
        
      } catch (err) {
        console.error("❌ Error processing Kafka message:", err);
      }
    });

  } catch (err) {
    console.error("❌ Error initializing Kafka Consumer:", err);
  }
}
init();
