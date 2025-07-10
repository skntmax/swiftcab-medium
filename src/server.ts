import Express from 'express';
import { env } from "./config/env";
import SocketServer from './services/socket';
import { socketEvents } from './config/socketEvents';
import { KafkaService } from './config/kafkaConnection';
import { kafkaSendPayload } from './types/d.types';
import { kafkaEvents } from './config/kafkaEvent';
import { v4 as uuidv4 } from 'uuid'
import { redisClient1, redisClient2 } from './services/redis/redis.index';


export let app = Express();
let port = env.PORT || 6000;

export const socket1 = new SocketServer();
 

socket1.on("custom-event", (socket, data) => {
  console.log("Custom event triggered by:", socket.id, "with data:", data);
  socket.emit("custom-event-response", { msg: "Handled from class!" });
});

// kafka  first service 
 const kafkaService = new KafkaService(['localhost:9092'], kafkaEvents.clientId);
  
 //  sending msg  to  kafka  
 async function  sendToKafka(paylod:kafkaSendPayload){
  await kafkaService.connectProducer();
  await kafkaService.sendMessage(paylod.topic,paylod.partition, paylod.msg );
} 


socket1.on(socketEvents.CAB_BOOK, async (socket, data) => {
  // console.log("Custom event triggered by:", socket.id, "with data:", data)
  // sending it to kafka by kafka producers 
  // later on  will be resolved by kafka  consumers
  // setTimeout(()=> socket.emit(socketEvents.CAB_BOOKED,{data:{driverName:"narendra"}}) , 5000  ) 
  const correlationId = uuidv4();
  const socketId = socket.id;
   // Store socket.id in Redis with correlationId in db0 of redis
  await redisClient1.set(correlationId, socketId);
  await redisClient1.expire(correlationId, 30); // auto-expire in 30 sec
  
  console.log(`📩 Stored socketId: ${socketId} for correlationId: ${correlationId}`);

  sendToKafka({
          topic:kafkaEvents.topic.CAB_BOOKING,
          partition:0,
          msg: [JSON.stringify({ ...data, correlationId })]
        })     
});

socket1.start(Number(port));
