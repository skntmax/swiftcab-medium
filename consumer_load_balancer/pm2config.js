module.exports = {
  dev: [
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
  ],
  prod: [
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
  ],
};