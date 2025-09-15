import { Emitter } from "@socket.io/redis-emitter";
import config from "../../config/config";
import prismaClient from "../../config/db";
import { redisClient1, RedisConn } from "../redis/redis.index";
import { socketEvents } from "../../config/socketEvents";

const redisClient = new RedisConn(config.redisConn.redisConnection1).redisClient;
const emitter = new Emitter(redisClient);

const drivercustomer = {
  getDriverConsetAndIntiateRide: async function (driverCustomerRideData?: any) {
    try {
      console.log("parsedData>>", driverCustomerRideData);

      const customer = driverCustomerRideData.userDetails;
      const customerView = driverCustomerRideData.customerViewDetails;
      const driver = driverCustomerRideData.driverDetails;



      
      // Step 1: Find driver in DB
      const driverObj = await prismaClient.driver_belongs_to_owner.findFirst({
        where: { users_driver_belongs_to_owner_driverTousers:{username:driver?.username}  },
        select: { id: true , },
      });

      console.log("driverObj>>", driverObj)
      if (!driverObj) {
        console.error("❌ Driver not found in DB:", driver?.username);
        return null; // or throw new Error("Driver not found")
      }

      // Step 2: Create ride
      const newRide = await prismaClient.users_have_rides.create({
        data: {
          total_fare: customerView?.netActiveFare?.netFare || 0,
          vhicle_driver:  driverObj.id, // integer FK
          // destination: customerView?.drop_name || "",
          is_food: 2,
          is_guide: 2,
          is_water: 1,
          // source: customerView?.pickup_name || "",
          travel_way: Number(customerView?.travel_way) ,
          user_id: Number(customer?.id) , // keep as number (FK to users)
          updated_on: new Date(),
          created_on: new Date(),
          source_lat:   customerView?.pickup_lat ? parseFloat(customerView.pickup_lat) : 0 ,
          source_lng: customerView?.pickup_lng ? parseFloat(customerView.pickup_lng) : 0,
          source_name: customerView?.pickup_name || "",
          destination_lat: customerView?.drop_lat ? parseFloat(customerView.drop_lat) : 0,
          destination_lng: customerView?.drop_lng ? parseFloat(customerView.drop_lng) : 0,
          destination_name: customerView?.drop_name || "",
          distance: customerView?.distance?.toString() || "0",
          drop_time: null,
          is_active: true,
          otp_varified: false,
          otp: Math.floor(1000 + Math.random() * 9000), // random 4-digit OTP
          payment_method: "CASH",
          pickup_date:   customerView?.pickup_date ? new Date(customerView.pickup_date) : new Date(),
          pickup_time: customerView?.pickup_time
            ? new Date(customerView.pickup_time)
            : new Date(),
          ride_started: false,
        },
      });

      console.log("✅ Ride created:", newRide);

      // Step 3: Mark driver unavailable in Redis
      const driverUsername = driver?.username;
      const { lat, lng, timestamp, correlationId } = driver?.meta || {};

      if (driverUsername) {
        await redisClient1.hset(`driver:${driverUsername}:meta`, {
          lat: lat?.toString() || "",
          lng: lng?.toString() || "",
          isAvailable: "false",
          timestamp: timestamp || new Date().toISOString(),
          correlationId: correlationId || driverCustomerRideData.correlationId,
        });
      }

      // send socket event to customer or user , that driver has accepter their  ride request 

      // Step 4: Emit event to user (ride initiated)

        // Step 1: Find driver in DB
      const driverUserObj = await prismaClient.users.findFirst({
        where: { username:driver?.username  },
        select: { id: true , username:true , first_name:true , last_name:true , avatar:true ,    },
      });

      const customerSocketId = await redisClient.get(customerView.correlationId);
      console.log("customerSocketId", customerSocketId)
      if (customerSocketId) {
        emitter.to(customerSocketId).emit(socketEvents.RIDE_INTIATED_BY_DRIVER, {
          rideId: newRide.id,
          message: "Your ride has been initiated!",
          driver: {
            username: driver?.username,
            id: driverObj.id,
            ...driverUserObj
          },
          pickup: {
            lat: newRide.source_lat,
            lng: newRide.source_lng,
            name: newRide.source_name,
          },
          destination: {
            lat: newRide.destination_lat,
            lng: newRide.destination_lng,
            name: newRide.destination_name,
          },
          otp: newRide.otp,
        });

        console.log(
          `📡 Event "ride:initiated" sent to user (correlationId: ${customerSocketId})`
        );
      }
          
      return newRide;
    } catch (err) {
      console.error("❌ Error creating ride:", err);
      throw err;
    }
  },
};

export default drivercustomer;
