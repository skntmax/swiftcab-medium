import { Consumer, ConsumerSubscribeTopics, EachBatchPayload, Kafka, EachMessagePayload, KafkaConfig } from 'kafkajs'

interface kafkaConfig {
brokers : string[]
clientId: string  
groupId:string
topic:string 
}

export  class KafkaService {
  private kafkaConsumer: Consumer
  // private messageProcessor: ExampleMessageProcessor
  brokers = ['localhost:9092'];
  clientId="";
  topic="";
  public constructor(kafakConfig:kafkaConfig) {
     this.clientId = kafakConfig.clientId;
    this.brokers = kafakConfig.brokers;
    this.topic = kafakConfig.topic;
    this.kafkaConsumer = this.createKafkaConsumer(kafakConfig)
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.topic],
      fromBeginning: true
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`- ${prefix} ${message.key}#${message.value}`)
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }


  public async startBatchConsumer(onMessageCallback: (message: any) => void): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.topic],
      fromBeginning: true
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`) 
             const value = message.value?.toString();
              value && onMessageCallback(value)
          }
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer(config:kafkaConfig): Consumer {
    const kafka = new Kafka({ 
      clientId: config.clientId,
      brokers: config.brokers
    })
    const consumer = kafka.consumer({ groupId: config.groupId })
    return consumer
  }
}