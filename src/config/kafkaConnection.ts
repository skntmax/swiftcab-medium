import { Kafka, Producer, Consumer, EachMessagePayload, PartitionAssigners } from 'kafkajs';
import { kafkaEvents } from './kafkaEvent';
import { CONSOLE_COLORS } from './constant';

export class KafkaService {
  private kafka;
  private consumer?: Consumer;
  private producer: Producer;
  brokers = ['kafka1:9092'];
  clientId="";

  constructor(brokers = this.brokers, clientId = `swift-cab-medium${Math.random().toString(36).substring(2, 10)}`) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.clientId = clientId;
    this.brokers = brokers;
    this.producer = this.kafka.producer();
  }

  async connectProducer(): Promise<void> {
    await this.producer.connect();
    console.log('✅ Kafka Producer connected');
  }

  async sendMessage(topic: string, partition = 0, messages: any[]): Promise<void> {
    await this.producer.send({
      topic,
      messages: messages.map((msg) => ({
        value: typeof msg === 'string' ? msg : JSON.stringify(msg),
        partition,
      })),
    });

    console.log(CONSOLE_COLORS.BgBlue, `📤 Sent ${messages.length} message(s) to topic "${topic}" on partition ${partition}, msg: ${JSON.stringify(messages)}`);
  }

  async createTopics(): Promise<void> {
    const admin = this.kafka.admin();
    await admin.connect();

    const topicsToCreate = Object.entries(kafkaEvents.PARTITIONS).map(([topic, partitionCount]) => {
      console.log("Creating topic:", topic, "with partitions:", partitionCount);
      return {
        topic,
        numPartitions: Number(partitionCount),
        replicationFactor: 1,
      };
    });

    const result = await admin.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true,
    });

    if (result) {
      console.log(`🎯 Kafka topics created successfully`);
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
    this.consumer = this.kafka.consumer({
      groupId,
      partitionAssigners: [PartitionAssigners.roundRobin],
    });

    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (value) {
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

  
  async listTopicsWithPartitions(): Promise<void> {
  const admin = this.kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();

  for (const topic of topics) {
    const metadata = await admin.fetchTopicMetadata({ topics: [topic] });

    metadata.topics.forEach(({ name, partitions }) => {
      console.log(`📌 Topic: ${name}`);
      partitions.forEach(({ partitionId, leader, replicas, isr }) => {
        console.log(
          `  ↪ Partition: ${partitionId}, Leader: ${leader}, Replicas: [${replicas}], ISR: [${isr}]`
        );
      });
    });
  }

  await admin.disconnect();
}
}
