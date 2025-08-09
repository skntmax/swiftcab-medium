import config from "../../config/config"
import { userRoles } from "../../config/constant"
import prismaClient from "../../config/db"
import { redisClient1 } from "../redis/redis.index"

const  driverService = {
    
    // getCountries : async function(cacheKey?:string) {
    //   try {
    //       let countries =await prismaClient.

    //      if(cacheKey && countries ){
    //        await redisClient1.set(cacheKey , JSON.stringify(countries), )
    //        await redisClient1.expire(cacheKey ,config.cache_time  )
    //      }
           
    //     return successReturn(countries)  

    //   }catch(err) {
    //       console.log(err)
    //            return failureReturn(err)  
    //   }
      
    // } , 

  }


export default  driverService

