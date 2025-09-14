import { KafkaService } from "./consumerInstance";
import { kafkaEvents } from "../config/kafkaEvent";
import { Emitter } from "@socket.io/redis-emitter";
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";
import { GOE_HASH_KEYS } from "../config/constant";

const uniqueClientId = `swift-cab-medium-${kafkaEvents.topic.TP_AVAILABLE_DRIVERS_POOL}-${Math.random().toString(36).substring(7)}`;
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
    // await kafka.connect(); // optional
    console.log("Kafka Connected. Starting Consumer...");

    await kafka.startBatchConsumer(async (msg: string) => {
      try {
        const driverData = JSON.parse(msg);  // Parse Kafka message
      const {  lat, lng, driver:driverUsername, isAvailable, timestamp ,correlationId } = driverData;
        // const GEO_KEY = `driver:${driverUsername}:geo`; // geo of this driver 
        const GEO_KEY = GOE_HASH_KEYS.NOIDA_GEO_HASH; // geo of this driver 
        

        console.log("driverData>>", driverData)
        // if driver is not logged in then remove from redis
        if(!driverData?.isLoggedIn) {
        // Remove driver from GEO set
        await redisClient.zrem(GEO_KEY, driverUsername);

        // Delete driver's metadata hash
        await redisClient.del(`driver:${driverUsername}:meta`);

        console.log("❌ Driver not logged in. Removed from Redis:", driverUsername);
        }

        // if user is active or logged in then only save the data
        if(driverData?.isLoggedIn) {
        // Store driver's location using GEOADD
        await redisClient.geoadd(
          GEO_KEY,
          lng,      // longitude first
          lat,      // latitude second
          driverUsername    // member name
        );

        // Store driver's metadata in a separate hash
        await redisClient.hset(
          `driver:${driverUsername}:meta`, // meta of this username 
          {
            lat: lat.toString(),
            lng: lng.toString(),
            isAvailable: isAvailable.toString(),
            timestamp,
            correlationId // driver socket id 
          }
        );

        console.log("✅ Received and saved Kafka message:", driverData);
        }
       

      } catch (err) {
        console.error("❌ Error processing Kafka message:", err);
      }
    });

  } catch (err) {
    console.error("❌ Error initializing Kafka Consumer:", err);
  }
}
init();
