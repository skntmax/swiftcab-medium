import { Queue } from 'bullmq';
import { REDIS_QUEUES } from '../../config/constant';
import config from '../../config/config';
import { queuesPayload } from '../../types/redis_queues';

class queue  {
      #queue 
      #queue_name
      #redisOptions 
      #redisConfig
      
     constructor(payload:queuesPayload) {
        this.#queue_name = payload.queue_name;
        this.#redisConfig = payload.redisConfig ?? config.redisConn.redisConnection1;
        this.#redisOptions = payload.redisOptions ?? config.redisConn.queueConfig.redisConnection1Config; // Default value

        this.#queue = new Queue(this.#queue_name ,{connection:this.#redisConfig }  );
         }

     enqueue(key:string, data:any) { 
             console.log("enqueuing this message " ,JSON.stringify(data) ," to this queue  ", this.#queue_name )
             this.#queue.add(key, JSON.stringify(data) , this.#redisOptions); 
             }
}
 
export const driverAcceptedRides  = new queue( { queue_name:REDIS_QUEUES.DRIVER_ACCEPTED_RIDES, redisConfig:config.redisConn.redisConnection2  }  ) // be default 0th database is selected 
export const variftyOtp = new queue( { queue_name:REDIS_QUEUES.VARIFY_OTP , redisConfig:config.redisConn.redisConnection2  }  ) // be default 0th database is selected 