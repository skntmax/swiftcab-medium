import { Kafka,Producer, Consumer, EachMessagePayload} from 'kafkajs'
import { kafkaEvents } from './kafkaEvent';
export class  KafkaService {

 
    kafka
    brokers = ['kafka1:9092', 'kafka2:9092']
    // brokers = ['kafka-broker-dev:9092'] 
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

 async sendMessage(topic: string, partition = 0 ,messages: any[], ): Promise<void> {
  await this.producer.send({
    topic,
    messages: messages.map((msg) => ({
      value: typeof msg === 'string' ? msg : JSON.stringify(msg),
      partition,
    })),
  });

  console.log(`📤 Sent ${messages.length} message(s) to topic "${topic}" on partition ${partition}`);
}

 async createTopics(): Promise<void> {
    const admin = this.kafka.admin();
    await admin.connect();

    const topicsToCreate = Object.values(kafkaEvents.topic).map((topic) => ({
      topic,
      numPartitions: 1, // you can increase for scaling
      replicationFactor: 1,
    }));

    const result = await admin.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true,
    });

    if (result) {
      console.log('🎯 Kafka topics created successfully');
    } else {
      console.log('⚠️ Kafka topics already exist or were not created');
    }

    await admin.disconnect();
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