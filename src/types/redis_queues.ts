import config from "../config/config"


export interface redisConnectionType {
    host: string,
    port: number ,
    db:number     
}


export interface redisConfigType {
    delay: number, // No delay by default
    removeOnComplete: boolean, // Auto-remove after completion
    removeOnFail: boolean, // Auto-remove failed jobs
    ttl: number, // TTL in milliseconds (default 60 seconds)  
}

export interface queuesPayload {
queue_name : string,
redisConfig? : redisConnectionType
redisOptions?:  redisConfigType
}




