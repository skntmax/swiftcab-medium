import { Kafka,Producer, Consumer, EachMessagePayload} from 'kafkajs'
export class  KafkaService {

 
    kafka
    brokers = ['kafka1:9092', 'kafka2:9092']
    private consumer?: Consumer;
    private producer: Producer;
    constructor(brokers=this.brokers, clientId="swift-cab-medium") {
    this.kafka = new Kafka({
     clientId,
     brokers: brokers,
   })

   this.producer =  this.kafka.producer()
    }

    async connectProducer(): Promise<void> {
    await this.producer.connect();
    console.log('✅ Kafka Producer connected');
   }

 async sendMessage(topic: string, messages: any[], partition = 0): Promise<void> {
  await this.producer.send({
    topic,
    messages: messages.map((msg) => ({
      value: typeof msg === 'string' ? msg : JSON.stringify(msg),
      partition,
    })),
  });

  console.log(`📤 Sent ${messages.length} message(s) to topic "${topic}" on partition ${partition}`);
}

  async createConsumer(
    groupId: string,
    topic: string,
    onMessageCallback: (message: string) => void
  ): Promise<void> {
    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (value) {
          // console.log(`📥 Received message: ${value}`);
          onMessageCallback(value);
        }
      },
    });

    console.log(`✅ Consumer subscribed to topic "${topic}"`);
  }

   async disconnect(): Promise<void> {
    await this.producer.disconnect();
    if (this.consumer) await this.consumer.disconnect();
    console.log('Kafka connections closed');
  }


}