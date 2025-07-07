// import { KafkaService } from "../config/kafkaConnection";
import { KafkaService } from "../config/kafkaConnection";
import { kafkaEvents } from "../config/kafkaEvent";
import { driverMatch } from "../services/driverMatch/driverMatchService";
// import { kafkaService } from "../server";

const cabBookingConsumer = new KafkaService(['localhost:9092'], kafkaEvents.clientId);

// const cabCancelConsumer = new KafkaService(['localhost:9092'], 'cab-cancel-service');

setTimeout(async () => {
  await cabBookingConsumer.createConsumer(
    kafkaEvents.consumerGroups.CAB_BOOKING.GRP1,
    kafkaEvents.topic.CAB_BOOKING,
    (msg:any) => {
      // console.log('🚕 Booking msg:', msg);
      driverMatch(msg)
    }
  );
}, 3000);
