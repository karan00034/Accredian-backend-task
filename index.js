const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const referralRoutes = require('./routes/referral');
const { PrismaClient } = require('@prisma/client');
const cors=require("cors");
// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors('*'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check Prisma connection
async function checkPrismaConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma is connected and up.');
  } catch (error) {
    console.error('Failed to connect to Prisma:', error);
  }
}

checkPrismaConnection();

// Use referral routes
app.use('/api/referral', referralRoutes);
app.use('/',()=>{
  console.log("hello world")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
