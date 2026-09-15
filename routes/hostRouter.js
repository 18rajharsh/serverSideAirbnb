// core Module
const path = require('path')

// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const hostController = require('../controllers/hostController');


hostRouter.get('/add-home', hostController.getAddHome);
hostRouter.post('/add-home', hostController.postAddHome);
hostRouter.get('/host-home-list', hostController.getHostHomes);
hostRouter.get('/edit-homes/:homeId', hostController.getEditHomes);

hostRouter.post('/edit-homes/:homeId', hostController.postEditHome);
hostRouter.post('/delete-homes/:homeId', hostController.postDeleteHome);

exports.hostRouter = hostRouter;
