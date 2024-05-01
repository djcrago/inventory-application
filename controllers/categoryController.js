const Category = require('../models/category');
const Item = require('../models/item');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'List of all Categories',
    category_list: allCategories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allItemDocs] = await Promise.all([
    Category.find({ name: req.params.name }).exec(),
    Item.find().populate('category').sort({ name: 1 }).exec(),
  ]);

  const categoryItems = [];

  allItemDocs.forEach((item) => {
    item.category.forEach((cat) => {
      if (cat.name === category[0].name) {
        categoryItems.push(item);
      }
    });
  });

  res.render('category_detail', {
    category: category[0],
    category_items: categoryItems,
  });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create New Category' });
});

//Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

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
  res.send('NOT IMPLEMENTED: Category Delete GET');
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category Delete POST');
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category Update GET');
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category Update POST');
});
