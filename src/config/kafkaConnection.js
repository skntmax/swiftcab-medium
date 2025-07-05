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
exports.KafkaService = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaService {
    constructor(brokers = this.brokers, clientId = "swift-cab-medium") {
        this.brokers = ['kafka1:9092', 'kafka2:9092'];
        this.kafka = new kafkajs_1.Kafka({
            clientId,
            brokers: brokers,
        });
        this.producer = this.kafka.producer();
    }
    connectProducer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            console.log('✅ Kafka Producer connected');
        });
    }
    sendMessage(topic_1, messages_1) {
        return __awaiter(this, arguments, void 0, function* (topic, messages, partition = 0) {
            yield this.producer.send({
                topic,
                messages: messages.map((msg) => ({
                    value: typeof msg === 'string' ? msg : JSON.stringify(msg),
                    partition,
                })),
            });
            console.log(`📤 Sent ${messages.length} message(s) to topic "${topic}" on partition ${partition}`);
        });
    }
    createConsumer(groupId, topic, onMessageCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.consumer = this.kafka.consumer({ groupId });
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic, fromBeginning: true });
            yield this.consumer.run({
                eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                    var _b;
                    const value = (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString();
                    if (value) {
                        console.log(`📥 Received message: ${value}`);
                        onMessageCallback(value);
                    }
                }),
            });
            console.log(`✅ Consumer subscribed to topic "${topic}"`);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.disconnect();
            if (this.consumer)
                yield this.consumer.disconnect();
            console.log('Kafka connections closed');
        });
    }
}
exports.KafkaService = KafkaService;
