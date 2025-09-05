// Imports
import { kafkaEvents } from "../config/kafkaEvent";
import { driverMatch } from "../services/driverMatch/driverMatchService";
import { socketEvents } from "../config/socketEvents";
import { Emitter } from "@socket.io/redis-emitter";
import config from "../config/config";
import { RedisConn } from "../services/redis/redis.index";
import { KafkaService } from "./consumerInstance";
import { GOE_HASH_KEYS } from "../config/constant";

// Kafka and Redis Configuration
const uniqueClientId = `swift-cab-medium-${Math.random().toString(36).substring(7)}`;
const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9092";

const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;

const kafka = new KafkaService({
  brokers: [KAFKA_HOST],
  clientId: uniqueClientId,
  groupId: kafkaEvents.consumerGroups.CAB_BOOKING.GRP2,
  topic: kafkaEvents.topic.CAB_BOOKING,
});

const emitter = new Emitter(redisClient);

// Kafka Consumer Initialization
async function init() {
  try {
    console.log("Connecting Kafka...");
    // await kafka.connect(); // Optional
    console.log("Kafka Connected. Starting CAB_BOOKING Consumer...");

    await kafka.startBatchConsumer(async (msg: string) => {
      try {
        const usersData = JSON.parse(msg);
        const { correlationId, user } = usersData;

        console.log("Received Kafka message:", usersData);
        const customerSocketId = await redisClient.get(correlationId);
        let availableDivers =await findNearbyDrivers(usersData)

         // 🔁 Invite all available drivers
          for (const driver of availableDivers) {
            const driverSocketId = await redisClient.get(driver.meta.correlationId); // or driver.meta.socket_id or similar key
            if (driverSocketId) {
              emitter.to(driverSocketId).emit(socketEvents.NEW_RIDE_REQUEST, {
                userDetails: user,
                pickupLocation: usersData?.pickup_name,
                distance: usersData?.distance,
                driverDetails :{...driver},
                customerViewDetails:driver?.customerViewDetails
              });
              console.log(`Sent ride request to driver: ${driver.username}`);
            }
          }

          // Optional Emit Example
          // if (customerSocketId) {
          //   const foundDriver = { driver: "ok" };
          //   setTimeout(() => {
          //     emitter.to(customerSocketId).emit(socketEvents.CAB_BOOKED, foundDriver);
          //     console.log(`Emit successful to socket ID ${customerSocketId}`);
          //   }, 4000);
          // }

        console.log(usersData);
      } catch (err) {
        console.error("❌ Error processing Kafka message:", err);
      }
    });
  } catch (err) {
    console.error("❌ Error initializing Kafka Consumer:", err);
  }
}

init();

// Nearby Driver Finder
async function findNearbyDrivers(customerLocationInfo:any): Promise<{
  username: string;
  distance: string;
  meta: Record<string, string>
  customerViewDetails:any
}[]> {
  try {
    const pickupLat = customerLocationInfo?.pickup_lat;
    const pickupLng = customerLocationInfo?.pickup_lng;
    const RADIUS_KM = 5;

      // Replace with actual key if dynamic
        const GEO_KEY = GOE_HASH_KEYS.NOIDA_GEO_HASH;

          const nearbyDrivers = await redisClient.geosearch(
          GEO_KEY,
          "FROMLONLAT",
          pickupLng,
          pickupLat,
          "BYRADIUS",
          RADIUS_KM,
          "km",
          "WITHDIST"
      ) as [string, string][];

    console.log("Found Near by driver ", nearbyDrivers ,"for pickup location", {
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        underRadium:RADIUS_KM+"KM",
        drop_lat: customerLocationInfo?.drop_lat,
        drop_lng: customerLocationInfo?.drop_lng,
        customer:customerLocationInfo?.user?.username,
    });

    const availableDrivers = await findAvailableDriversRecursively(nearbyDrivers, redisClient, customerLocationInfo);    
    return availableDrivers;
  } catch (err) {
    console.error("Redis error:", err);
    return [];
  }
}


async function findAvailableDriversRecursively(
  nearbyDrivers: [string, string][],
  redisClient: any,
  customerLocationInfo: any,
  availableDrivers: any[] = []
): Promise<any[]> {
  for (const [username, distance] of nearbyDrivers) {
    const meta = await redisClient.hgetall(`driver:${username}:meta`);
    if (meta?.isAvailable === "true") {
      availableDrivers.push({
        username,
        distance,
        meta,
        customerViewDetails: customerLocationInfo,
      });
    }
  }

  console.log("availableDrivers", availableDrivers);
  if (availableDrivers.length === 0) {
    // Wait 1 second before retrying (you can change this)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 sec and again search for drivers 
    return findAvailableDriversRecursively(nearbyDrivers, redisClient, customerLocationInfo, []);
  }

  return availableDrivers;
}
