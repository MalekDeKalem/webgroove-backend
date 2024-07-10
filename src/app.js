// import express from 'express';

// import "express-async-errors" 
// import userRouter from '../routes/user';
const cors= require("cors")
const express = require("express")
const userRouter = require("../routes/userRouter");
const loginRouter = require("../routes/loginRouter");
const projectRouter = require("../routes/ProjectRouter");
const router = require("../routes/userVerwaltungRouter");
const { sequelize } = require("../entities/db-connection");

const app = express();
app.use(cors());


//middleware    
app.use('*', express.json())

app.use("/api/user", userRouter)
app.use("/api/login", loginRouter)
app.use("/api/projects", projectRouter)
app.use("/api/manageUser", router);

  

// export default app;
module.exports = app