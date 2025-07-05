// import { KafkaService } from "../config/kafkaConnection";
import { KafkaService } from "../config/kafkaConnection";
import { kafkaEvents } from "../config/kafkaEvent";
// import { kafkaService } from "../server";

const cabBookingConsumer = new KafkaService(['localhost:9092'], kafkaEvents.clientId);

// const cabCancelConsumer = new KafkaService(['localhost:9092'], 'cab-cancel-service');

setTimeout(async () => {
  await cabBookingConsumer.createConsumer(
    kafkaEvents.consumerGroups.CAB_BOOKING.GRP1,
    kafkaEvents.topic.CAB_BOOKING,
    (msg:any) => {
      console.log('🚕 Booking msg:', msg);
    }
  );
}, 3000);

// setTimeout(async () => {
//   await cabCancelConsumer.createConsumer(
//     kafkaEvents.consumerGroups.CAB_CANCEL.GRP2,
//     kafkaEvents.topic.CAB_CANCEL,
//     (msg) => {
//       console.log('❌ Cancel msg:', msg);
//     }
//   );
// }, 5000);
