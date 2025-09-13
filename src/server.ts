import Express from 'express';
import { env } from "./config/env";
import SocketServer from './services/socket';
import { socketEvents } from './config/socketEvents';
import { KafkaService } from './config/kafkaConnection';
import { kafkaSendPayload } from './types/d.types';
import { kafkaEvents } from './config/kafkaEvent';
import { v4 as uuidv4 } from 'uuid'
import { redisClient1, redisClient2 } from './services/redis/redis.index';
import { CONSOLE_COLORS } from './config/constant';
import cors from 'cors'
import { getDriverUniqueSocketCorrelationId, togglePartitionByTopic } from './config/utils';
// import * as dotenv from 'dotenv';
// dotenv.config({ 
//   path: process.env.ENV=="development"?'.env.development' : 
//   process.env.ENV=="production"?'.env.production' :"env.stage"
//   });

export let app = Express();
let port = env.PORT || 6000;
let kafkaHost = env.KAFKA_HOST || "localhost:9092";

function togglePartition() {
  return  Math.floor(Math.random() * kafkaEvents.PARTITIONS.TP_AVAILABLE_DRIVERS_POOL);
}

export const socket1 = new SocketServer();

socket1.on("custom-event", (socket, data) => {
  console.log("Custom event triggered by:", socket.id, "with data:", data);
  socket.emit("custom-event-response", { msg: "Handled from class!" });
});

app.use(Express.json()); 
app.use(cors({
     origin: '*',
    //  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
 }))

 
// app.post('/driver-live-location', (req, res) => {
//   console.log("req.body",req.body)
//   res.send('Driver live location received');
// })
 
// kafka  first service 
 const kafkaService = new KafkaService([kafkaHost], `swift-cab-medium`);
 (async function initKafkaService(){
  await kafkaService.createTopics();
  await kafkaService.listTopicsWithPartitions();
 })()
 
  
 //  sending msg  to  kafka  
 async function  sendToKafka(paylod:kafkaSendPayload){
  await kafkaService.connectProducer();
  await kafkaService.sendMessage(paylod.topic,paylod.partition, paylod.msg );
} 


//  intialised by  customer only 
socket1.on(socketEvents.CAB_BOOK, async (socket, data) => {
  // setTimeout(()=> socket.emit(socketEvents.CAB_BOOKED,{data:{driverName:"narendra"}}) , 5000  ) 
  const correlationId = uuidv4();
  const socketId = socket.id;
   // Store socket.id in Redis with correlationId in db0 of redis
  await redisClient1.set(correlationId, socketId);
  await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec
  
  console.log( CONSOLE_COLORS.FgGreen ,`📩 Stored socketId: ${socketId} for correlationId: ${correlationId}`);
  sendToKafka({
          topic:kafkaEvents.topic.CAB_BOOKING,
          partition:0,
          msg: [JSON.stringify({ ...data, correlationId })]
        })     
  });


//  intialised by  driver only 
// socket1.on(socketEvents.SEARCH_CUSTOMER, async (socket, driverUser) => {
//   // setTimeout(()=> socket.emit(socketEvents.CAB_BOOKED,{data:{driverName:"narendra"}}) , 5000  ) 
//   const correlationId = uuidv4();
//   const socketId = socket.id;
//    // Store socket.id in Redis with correlationId in db0 of redis
//   await redisClient1.set(correlationId, socketId);
//   await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec

//   console.log("available  driver went to ", kafkaEvents.topic.AVAILABLE_DRIVERS ,"TOPIC , partition ",  0 )
//   sendToKafka({
//           topic:kafkaEvents.topic.AVAILABLE_DRIVERS,
//           partition:0,
//           msg: [JSON.stringify({ ...driverUser, correlationId })]
//         })     
// });




// receive at every five seconds by the driver location 
socket1.on(socketEvents.EV_DRIVER_LIVE_LOCATION, async (socket, driverLocation) => {
  
  const correlationId =getDriverUniqueSocketCorrelationId() ;
  const socketId = socket.id;
   // Store socket.id in Redis with correlationId in db0 of redis
  await redisClient1.set(correlationId, socketId);
  await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec
  
   sendToKafka({
          topic:kafkaEvents.topic.TP_AVAILABLE_DRIVERS_POOL,
          partition:togglePartition(),
          msg: [JSON.stringify({ ...driverLocation ,correlationId})]
        })     
  });


  

  // when rides got accepted by driver  
socket1.on(socketEvents.DRIVER_ACCEPTED_THE_RIDE, async (socket, rideDetailsWithCustomerDriverObject) => {
  
  const correlationId =getDriverUniqueSocketCorrelationId() ;
  const socketId = socket.id;
   // Store socket.id in Redis with correlationId in db0 of redis
  await redisClient1.set(correlationId, socketId);
  await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec
  
   sendToKafka({
          topic:kafkaEvents.topic.TP_DRIVER_ACCEPTED_RIDES,
          partition:togglePartitionByTopic(kafkaEvents.topic.TP_DRIVER_ACCEPTED_RIDES as "TP_DRIVER_ACCEPTED_RIDES"),
          msg: [JSON.stringify({ ...rideDetailsWithCustomerDriverObject ,correlationId})]
        })     
  }
);
  

  socket1.on(socketEvents.EV_DRIVER_LOGGED_OUT, async (socket, driverLocation) => {
    const correlationId =getDriverUniqueSocketCorrelationId() ;
    const socketId = socket.id;
    // Store socket.id in Redis with correlationId in db0 of redis
    await redisClient1.set(correlationId, socketId);
    await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec
    sendToKafka({
            topic:kafkaEvents.topic.TP_AVAILABLE_DRIVERS_POOL,
            partition:togglePartition(),
            msg: [JSON.stringify({ ...driverLocation, correlationId})]
          })     
  });

socket1.start(Number(port));
