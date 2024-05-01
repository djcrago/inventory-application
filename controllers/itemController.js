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

  res.render('index', {
    title: 'Little Family Inventory Management Home',
    item_count_total: itemDocs.length,
    category_count_total: categoryDocs.length,
    category_counts: categoryCounts,
  });
});

// Display list of all Item.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, 'name price number_in_stock')
    .sort({ name: 1 })
    .exec();

  res.render('item_list', { title: 'List of all Items', item_list: allItems });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('item_detail', { item });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('item_form', {
    title: 'Create New Item',
    categories: allCategories,
  });
});

//Handle Item create on POST.
exports.item_create_post = [
  // Convert category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.genre === undefined ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Must choose at least one category')
    .custom((value) => {
      if (value[0] === undefined) return false;
      return true;
    })
    .escape(),
  body('price', 'Price must be at least $0.01')
    .custom((value) => {
      if (+value < 0.01) {
        return false;
      }
      return true;
    })
    .escape(),
  body('number_in_stock').notEmpty().escape(),

  // Process request after validation/sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      // Mark selected categories as checked.
      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = 'true';
        }
      }

      res.render('item_form', {
        title: 'Create New Item',
        item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    res.redirect('/inventory/items');
  }

  res.render('item_delete', { title: 'Delete Item', item });
});

// Handle Item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect('/inventory/items');
});

// Display Item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (item === null) {
    // No results
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category) => {
    if (item.category.includes(category._id)) category.checked = 'true';
  });

  res.render('item_form', {
    title: 'Create New Item',
    item,
    categories: allCategories,
  });
});

// Handle Item update on POST.
exports.item_update_post = [
  // Convert category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.genre === undefined ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Must choose at least one category')
    .custom((value) => {
      if (value[0] === undefined) return false;
      return true;
    })
    .escape(),
  body('price', 'Price must be at least $0.01')
    .custom((value) => {
      if (+value < 0.01) {
        return false;
      }
      return true;
    })
    .escape(),
  body('number_in_stock').notEmpty().escape(),

  // Process request after validation/sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      // Mark selected categories as checked.
      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = 'true';
        }
      }

      res.render('item_form', {
        title: 'Update New Item',
        item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
