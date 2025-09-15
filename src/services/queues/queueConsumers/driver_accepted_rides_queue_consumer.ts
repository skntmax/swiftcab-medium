import { Worker } from 'bullmq';
import { REDIS_QUEUES } from '../../../config/constant';
import config from '../../../config/config';
import drivercustomer from '../../queryServices/drivercustomer.service';

export function driveAcceptedRidesConsumeTasks() {
 console.log(">> queue consumer driveAcceptedRidesConsumeTasks started ") 
  const myWorker = new Worker(REDIS_QUEUES.DRIVER_ACCEPTED_RIDES, async (job) => {
    console.log('Processing job:', job.id);
    let parsedData =  JSON.parse(job?.data) 
    await drivercustomer.getDriverConsetAndIntiateRide(parsedData)
     
},
 {
    connection: config.redisConn.redisConnection2,
    limiter: {
        max: 50, // 50 jobs per 10 seconds 
        duration: 10 * 1000
    }
 }
);
  
myWorker.on('completed', (job) => {
    console.log(`Job with id ${job.id} has been completed`);
  });
  
  myWorker.on('failed', (job:any, err) => {
    console.log(`processing failed `);
  });


}