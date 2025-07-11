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


export let app = Express();
let port = env.PORT || 6000;
let kafkaPort = env.KAFKA_HOST || "localhost:9092";


export const socket1 = new SocketServer();
 

socket1.on("custom-event", (socket, data) => {
  console.log("Custom event triggered by:", socket.id, "with data:", data);
  socket.emit("custom-event-response", { msg: "Handled from class!" });
});

// kafka  first service 
 const kafkaService = new KafkaService([kafkaPort], kafkaEvents.clientId);
  
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
socket1.on(socketEvents.SEARCH_CUSTOMER, async (socket, driverUser) => {
  // setTimeout(()=> socket.emit(socketEvents.CAB_BOOKED,{data:{driverName:"narendra"}}) , 5000  ) 
  const correlationId = uuidv4();
  const socketId = socket.id;
   // Store socket.id in Redis with correlationId in db0 of redis
  await redisClient1.set(correlationId, socketId);
  await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec

  console.log("available  driver went to ", kafkaEvents.topic.AVAILABLE_DRIVERS ,"TOPIC , partition ",  0 )
  sendToKafka({
          topic:kafkaEvents.topic.AVAILABLE_DRIVERS,
          partition:0,
          msg: [JSON.stringify({ ...driverUser, correlationId })]
        })     
});

socket1.start(Number(port));
