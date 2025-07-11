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


