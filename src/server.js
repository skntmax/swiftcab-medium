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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket1 = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const socket_1 = __importDefault(require("./services/socket"));
const socketEvents_1 = require("./config/socketEvents");
const kafkaConnection_1 = require("./config/kafkaConnection");
const kafkaEvent_1 = require("./config/kafkaEvent");
exports.app = (0, express_1.default)();
let port = env_1.env.PORT || 6000;
exports.socket1 = new socket_1.default();
exports.socket1.on("custom-event", (socket, data) => {
    console.log("Custom event triggered by:", socket.id, "with data:", data);
    socket.emit("custom-event-response", { msg: "Handled from class!" });
});
exports.socket1.on(socketEvents_1.socketEvents.CAB_BOOK, (socket, data) => {
    // console.log("Custom event triggered by:", socket.id, "with data:", data)
    // sending it to kafka by kafka producers 
    // later on  will be resolved by kafka  consumers
    setTimeout(() => socket.emit(socketEvents_1.socketEvents.CAB_BOOKED, { data: { driverName: "narendra" } }), 5000);
    sendToKafka({
        topic: kafkaEvent_1.kafkaEvents.topic.CAB_BOOKING,
        partition: 0,
        msg: [JSON.stringify(data)]
    });
});
const sendToKafka = (paylod) => __awaiter(void 0, void 0, void 0, function* () {
    const kafkaService = new kafkaConnection_1.KafkaService(['localhost:9092'], 'swift-cab-medium');
    yield kafkaService.connectProducer();
    yield kafkaService.sendMessage(paylod.topic, paylod.msg, paylod.partition);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield kafkaService.createConsumer(kafkaEvent_1.kafkaEvents.consumerGroups.CAB_BOOKING.GRP1, kafkaEvent_1.kafkaEvents.topic.CAB_BOOKING, (msg) => {
            console.log('✅ Consumer callback:', msg);
        });
    }), 5000);
});
exports.socket1.start(Number(port));
