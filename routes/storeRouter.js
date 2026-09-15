// core Module
const path = require('path')

// Local Module
const storeController = require('../controllers/storeController')

// External Module
const express = require('express');
const storeRouter = express.Router();


storeRouter.get('/', storeController.getIndex);
storeRouter.get('/homes', storeController.getHome);
storeRouter.get('/bookings', storeController.getBookings);
storeRouter.get('/favourites', storeController.getFavouriteList);
storeRouter.get('/homeList', storeController.getHomeList);
storeRouter.get('/homes/:homeId', storeController.getHomeId);

storeRouter.post('/favourites', storeController.postAddToFavourite);
storeRouter.post('/favourites/delete/:homeId', storeController.deleteFavourite);

exports.storeRouter = storeRouter;