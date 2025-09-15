import { driveAcceptedRidesConsumeTasks } from "./driver_accepted_rides_queue_consumer";
// all queue consumers will be intiated here
export function intiQueueConsumers() {
     driveAcceptedRidesConsumeTasks() // consumer who have accepted customer rides  
}

intiQueueConsumers()