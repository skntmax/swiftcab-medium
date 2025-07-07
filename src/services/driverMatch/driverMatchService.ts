import prismaClient from "../../config/db"

export async function driverMatch(payload:any){
    console.log("payload>>",JSON.parse(payload))
    let users =await prismaClient.users.findMany()
    console.log("users>>",users)

}