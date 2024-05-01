const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const [itemDocs, categoryDocs] = await Promise.all([
    Item.find().populate('category').exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  const categoryCounts = [];

  categoryDocs.forEach((categoryDoc) => {
    let count = 0;

    itemDocs.forEach((item) => {
      item.category.forEach((category) => {
        if (category.name === categoryDoc.name) count += 1;
      });
    });

    categoryCounts.push({
      name: categoryDoc.name,
      count,
    });
  });

  console.log(categoryCounts);

  res.render('index', {
    title: 'Little Family Inventory Management Home',
    item_count_total: itemDocs.length,
    category_count_total: categoryDocs.length,
    category_counts: categoryCounts,
  });
});

// Display list of all Item.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();

  res.render('item_list', { title: 'List of all Items', item_list: allItems });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Detail');
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Create GET');
});

//Handle Item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Create POST');
});

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Delete GET');
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Delete POST');
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Update GET');
});

// Handle Item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item Update POST');
});
