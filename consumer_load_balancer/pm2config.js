 
module.exports = {
  dev: [
    // kafka consumers
    {
      script: "init:kafka:driverConsumerPoolInstance:dev",
      base: "kafka-driver-pool-consumer-dev",
      count: 1,
    },
    {
      script: "init:kafka:userDriverRequestInstance:dev",
      base: "kafka-user-driver-request-consumer-dev",
      count: 1,
    },
    {
      script: "init:kafka:driverAcceptedRides:dev",
      base: "kafka-driver-accepted-rides-consumer-dev",
      count: 1,
    },
     
    
    // 🚀 New Redis consumer
    {
      script: "init:redis:acceptedRideUpdateByDriver:dev",
      base: "redis-accepted-ride-update-consumer-dev",
      count: 2 // spin up 2 instances
    }
  ],
  prod: [
    // kafka consumers
    {
      script: "init:kafka:driverConsumerPoolInstance:prod",
      base: "kafka-driver-pool-consumer-prod",
      count: 5,
    },
    {
      script: "init:kafka:userDriverRequestInstance:prod",
      base: "kafka-user-driver-request-consumer-prod",
      count: 2,
    },
    {
      script: "init:kafka:driverAcceptedRides:prod",
      base: "kafka-driver-accepted-rides-consumer-prod",
      count: 5,
    },
    
    // 🚀 New Redis consumer
    {
      script: "init:redis:acceptedRideUpdateByDriver:prod",
      base: "redis-accepted-ride-update-consumer-prod",
      count: 5 // spin up 2 instances
    }
    // 🚀 New Redis consumer
  ],
};