const express = require('express');
const router = express.Router();

// Require controller modules
const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

// ITEM ROUTES

// GET inventory home page.
router.get('/', item_controller.index);

// GET request for creating an Item. NOTE: This must come before routes that display Item (uses id).
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an Item.
router.post('/item/create', item_controller.item_create_post);

// GET request to delete an Item.
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete an Item.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update an Item.
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update an Item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one Item.
router.get('/item/:id', item_controller.item_detail);

// GET request for all Items.
router.get('/items', item_controller.item_list);

// CATEGORY ROUTES

// GET request for creating a Category. NOTE: This must come before routes that display Category (uses id).
router.get('/category/create', category_controller.category_create_get);

// POST request for creating a Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete a Category.
router.get('/category/:name/delete', category_controller.category_delete_get);

// POST request to delete a Category.
router.post('/category/:name/delete', category_controller.category_delete_post);

// GET request to update a Category.
router.get('/category/:name/update', category_controller.category_update_get);

// POST request to update a Category.
router.post('/category/:name/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:name', category_controller.category_detail);

// GET request for all Categories.
router.get('/categories', category_controller.category_list);

module.exports = router;
