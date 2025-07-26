export const kafkaEvents = {
    clientId:`swift-cab-medium-${Math.random().toString(36).substring(7)}`,
    topic:{
        "CAB_BOOKING":"CAB_BOOKING", // all cab boking will in to this  topic 
        "CAB_BOOKED":"CAB_BOOKED", // all cab boking will in to this  topic 
        "TP_AVAILABLE_DRIVERS_POOL":"TP_AVAILABLE_DRIVERS_POOL", // all cab boking will in to this  topic 
    },
    PARTITIONS:{
    "CAB_BOOKING":2,
    "CAB_BOOKED":2,  
    "TP_AVAILABLE_DRIVERS_POOL":5,     
    },

    consumerGroups:{
        CAB_BOOKING:{
            GRP1:"GRP1",
            GRP2:"GRP2"
        },
        TP_AVAILABLE_DRIVERS_POOL:{
            GRP1:"GRP1",
        },
        

    }
}


