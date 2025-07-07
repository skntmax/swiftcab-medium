import prismaClient from "../../config/db"

export async function driverMatch(payload:any){
    console.log("payload>>",JSON.parse(payload))
    return JSON.parse(payload)

}