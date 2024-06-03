const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');

// Display site home page.
exports.index = asyncHandler(async (req, res, next) => {
  const [allItems, allCategories] = await Promise.all([
    Item.find().populate('category').exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  const categoriesWithItemCounts = [];

  allCategories.forEach((category) => {
    let itemCount = 0;

    allItems.forEach((item) => {
      item.category.forEach((cat) => {
        if (cat.name === category.name) itemCount += 1;
      });
    });

    categoriesWithItemCounts.push({
      name: category.name,
      item_count: itemCount,
    });
  });

  res.render('index', {
    title: 'Inventory Management',
    all_items: allItems.length,
    all_categories: categoriesWithItemCounts,
  });
});

// Display list of all Items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();

  res.render('item_list', {
    title: 'All Items',
    all_items: allItems,
  });
});

// Display detail page for a specific Item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('item_detail', {
    item,
  });
});

// Display Item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('item_form', {
    title: 'Create New Item',
    all_categories: allCategories,
  });
});

//Handle Item create on POST.
exports.item_create_post = [
  // Convert category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        req.body.category === undefined ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Must choose at least one category')
    .custom((value) => {
      if (value.length === 0) return false;
      return true;
    })
    .escape(),
  body('price', 'Price cannot be 0')
    .custom((value) => {
      if (value === '0') return false;
      return true;
    })
    .escape(),
  body('number_in_stock').notEmpty().escape(),

  // Process request after validation/sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
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

      allCategories.forEach((category) => {
        if (item.category.includes(category._id)) category.checked = 'true';
      });

      res.render('item_form', {
        title: 'Create New Item',
        item,
        all_categories: allCategories,
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

  if (item === null) res.redirect('/inventory/items');

  res.render('item_delete', {
    title: 'Delete Item',
    item,
  });
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
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category) => {
    if (item.category.includes(category._id)) category.checked = 'true';
  });

  res.render('item_form', {
    title: 'Update Item',
    item,
    all_categories: allCategories,
  });
});

// Handle Item update on POST.
exports.item_update_post = [
  // Convert category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        req.body.category === undefined ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Must choose at least one category')
    .custom((value) => {
      if (value.length === 0) return false;
      return true;
    })
    .escape(),
  body('price', 'Price cannot be 0')
    .custom((value) => {
      if (value === '0') return false;
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

      allCategories.forEach((category) => {
        if (item.category.includes(category._id)) category.checked = 'true';
      });

      res.render('item_form', {
        title: 'Update Item',
        item,
        all_categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(item.url);
    }
  }),
];
