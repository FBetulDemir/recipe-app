import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


// const express = require('express');

const app = express();
app.use(cors());

app.listen(3001, () =>{"Server started!"})