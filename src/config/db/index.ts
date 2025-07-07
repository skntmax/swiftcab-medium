import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient()


type ProcedureParams = any[]; // To support any parameter type

// export async function executeStoredProcedure(
//   procedureName: string,
//   params: any[] = []
// ): Promise<any> {
//   try {
//     // Construct the query string with explicit type casting
//     const query = params.length > 0
//       ? `SELECT * FROM ${procedureName}(${params
//           .map((_, index) => `$${index + 1}::${getParameterType(index)}`)
//           .join(', ')})`
//       : `SELECT * FROM ${procedureName}()`;

//     // Execute the stored procedure using Prisma's $queryRawUnsafe
//     const result = await prismaClient.$queryRawUnsafe(query, ...params);

//     return result;
//   } catch (error) {
//     console.error('Error executing stored procedure:', error);
//     throw error;
//   } finally {
//     await prismaClient.$disconnect();
//   }
// }

// // Helper function to determine parameter types
// function getParameterType(index: number): string {
//   // Define the expected parameter types for the stored procedure
//   const parameterTypes = ['text', 'text', 'int']; // Adjust based on your stored procedure
//   return parameterTypes[index] || 'text'; // Default to 'text' if not specified
// }
  
export default prismaClient

