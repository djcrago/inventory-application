const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'All Categories',
    all_categories: allCategories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ name: req.params.name }).exec();
  const itemsInCategory = await Item.find({ category: category._id }).exec();

  res.render('category_detail', {
    category,
    items_in_category: itemsInCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create New Category' });
});

//Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields
  body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),

  // Process request after validation/sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Create New Category',
        category,
        errors: errors.array(),
      });
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();

      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ name: req.params.name }).exec();
  const itemsInCategory = await Item.find({ category: category._id }).exec();

  if (category === null) res.redirect('/inventory/categories');

  res.render('category_delete', {
    title: 'Delete Category',
    category,
    items_in_category: itemsInCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.body.categoryid);
  res.redirect('/inventory/categories');
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ name: req.params.name }).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update Category',
    category,
  });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields
  body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),

  // Process request after validation/sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.body.categoryid,
    });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Update Category',
        category,
        errors: errors.array(),
      });
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();

      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await Category.findByIdAndUpdate(req.body.categoryid, category, {});
        res.redirect(category.url);
      }
    }
  }),
];
