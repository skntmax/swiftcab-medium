export const kafkaEvents = {
    clientId:"swift-cab-medium",
    topic:{
        "CAB_BOOKING":"CAB_BOOKING", // all cab boking will in to this  topic , partition will be based on cities , bydefault - 0 
        "CAB_BOOKED":"CAB_BOOKED", // all cab boking will in to this  topic ,   partition will be based on cities ,bydefault - 0 
    },

    consumerGroups:{
        CAB_BOOKING:{
            ['GRP1']:"GRP1",
            ['GRP2']:"GRP2"
        }
    }
}






 "init:kafka:consumer1:dev": "npx tsc && env-cmd  -f .env.development nodemon ./src/consumer_groups/kafka_consumer.ts",
    "init:kafka:consumer1:prod": "npx tsc && env-cmd  -f .env.production nodemon ./src/consumer_groups/kafka_consumer.ts",
    "init:kafka:consumer2:dev": "npx tsc && env-cmd  -f .env.development node ./dist/consumer_groups/kafka_consumer2.js",
    "init:kafka:driver_consumer_pool:dev": "env-cmd  -f .env.development nodemon ./src/consumer_groups/driver_pool_consumer.ts",
    "init:kafka:driver_consumer_pool:prod": "env-cmd  -f .env.production node ./dist/consumer_groups/driver_pool_consumer.js" 


    

    Open Command Prompt (cmd) or PowerShell and run:

    netstat -ano | findstr :7001


    You’ll get something like:

    TCP    0.0.0.0:7001       0.0.0.0:0       LISTENING       12345


    👉 The last number (12345) is the PID (Process ID).

    🔨 Step 2: Kill the process

    Run:

    taskkill /PID 12345 /F


    Replace 12345 with the PID you found.