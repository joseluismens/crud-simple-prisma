import { PrismaClient } from '@prisma/client'
import express, {Router} from 'express';
import  app  from "./app";

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here 

  try {
    await prisma.$connect();
    console.log("database conected");
    
    app.listen(3001);
    console.log(' server is listening on port ',3001);
} catch (error) {

  await prisma.$disconnect();
   console.log("prisma discconet");
   
    
}
 
}

main();