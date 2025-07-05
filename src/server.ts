import Express from 'express';
import { env } from "./config/env";
import SocketServer from './services/socket';
import { socketEvents } from './config/socketEvents';
import { KafkaService } from './config/kafkaConnection';
import { kafkaSendPayload } from './types/d.types';
import { kafkaEvents } from './config/kafkaEvent';

export let app = Express();
let port = env.PORT || 6000;

export const socket1 = new SocketServer();

socket1.on("custom-event", (socket, data) => {
  console.log("Custom event triggered by:", socket.id, "with data:", data);
  socket.emit("custom-event-response", { msg: "Handled from class!" });
});


socket1.on(socketEvents.CAB_BOOK, (socket, data) => {
  // console.log("Custom event triggered by:", socket.id, "with data:", data)
  // sending it to kafka by kafka producers 
  // later on  will be resolved by kafka  consumers
  setTimeout(()=> socket.emit(socketEvents.CAB_BOOKED,{data:{driverName:"narendra"}}) , 5000  ) 
        
  sendToKafka({
          topic:kafkaEvents.topic.CAB_BOOKING,
          partition:0,
          msg:[JSON.stringify(data)]
        })
        
});


 const kafkaService = new KafkaService(['localhost:9092'], kafkaEvents.clientId);
  const  sendToKafka= async (paylod:kafkaSendPayload)=>{
  await kafkaService.connectProducer();
  await kafkaService.sendMessage(paylod.topic, paylod.msg, paylod.partition);
  
} 




socket1.start(Number(port));
