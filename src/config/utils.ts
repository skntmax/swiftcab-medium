import { v4 as uuidv4 } from 'uuid'
export  function getDriverUniqueSocketCorrelationId(): string {
  return `DRIVER:SOCKET:${uuidv4()}`;
}