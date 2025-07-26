export interface kafkaSendPayload {
 topic: string  
 partition: number 
 msg:string[] | any   
}