"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkaConnection_1 = require("../config/kafkaConnection");
const kafkaEvent_1 = require("../config/kafkaEvent");
const cabBookingConsumer = new kafkaConnection_1.KafkaService(['localhost:9092'], 'cab-booking-service');
// const cabCancelConsumer = new KafkaService(['localhost:9092'], 'cab-cancel-service');
setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
    yield cabBookingConsumer.createConsumer(kafkaEvent_1.kafkaEvents.consumerGroups.CAB_BOOKING.GRP1, kafkaEvent_1.kafkaEvents.topic.CAB_BOOKING, (msg) => {
        console.log('🚕 Booking msg:', msg);
    });
}), 3000);
// setTimeout(async () => {
//   await cabCancelConsumer.createConsumer(
//     kafkaEvents.consumerGroups.CAB_CANCEL.GRP2,
//     kafkaEvents.topic.CAB_CANCEL,
//     (msg) => {
//       console.log('❌ Cancel msg:', msg);
//     }
//   );
// }, 5000);
