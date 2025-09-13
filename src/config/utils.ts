import { v4 as uuidv4 } from 'uuid'
import { kafkaEvents } from './kafkaEvent';
export  function getDriverUniqueSocketCorrelationId(): string {
  return `DRIVER:SOCKET:${uuidv4()}`;
}

type Topic = keyof typeof kafkaEvents.topic;

export function togglePartitionByTopic(topic: Topic):number {
  return  Math.floor(Math.random() * kafkaEvents.PARTITIONS[topic]);
}
