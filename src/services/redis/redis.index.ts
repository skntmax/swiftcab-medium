
import config from '../../config/config'
import constant from '../../config/constant'
import Redis from 'ioredis'

type redisConnType = {
            host?: string,
            port: number,
            db?:number 
}
 
export class RedisConn {
    
    redisClient
    constructor(configuration:redisConnType=config.redisConn.redisConnection1) { 
        this.redisClient = new Redis(configuration);
        console.log('redis connected at ',configuration.port , "database:",configuration.db  )
     }

    get(key:string) {
    return this.redisClient.get(key)
    }

    set(key:string, value:any) {
        return this.redisClient.set(key, JSON.stringify(value)  )
        }

        
    expire(key:string, expireTime:number=constant.cache_time) {
        return this.redisClient.expire(key,expireTime )
     }

          
    del(key:string) {
        return this.redisClient.del(key)
     }
         

}

const redisClient1 = (new  RedisConn(config.redisConn.redisConnection1)).redisClient // for common use with databse 1 / for  cab booked service  
const redisClient2 = (new  RedisConn(config.redisConn.redisConnection2)).redisClient // for common use with databse 1 / for  cab booked service  
 export  {redisClient1 , redisClient2}