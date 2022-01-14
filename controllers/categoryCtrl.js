const Category = require('../models/categoryModel');

const categoryCtrl = {
    getCategories: async(req, res) => {
      try {
          const categories = await Category.find();
          res.json(categories);
      } catch (err) {
          return res.status(500).json({msg: err.message});
      }
    },
    createCategory: async (req, res) => {
      try {
          //if user have role = 1 ---> admin 
          //Only admin can create, delete and update category
          const {name} = req.body;
          const categoty = await Category.findOne({name});
          if(categoty) return res.status(400).json({msg: "This category already exists."});

          const newCategory = new Category({name});

          await newCategory.save();
          res.json({msg: "Created a categoty"});
          res.json('Check admin success');
      } catch (err) {
          return res.status(500).json({msg: err.message});
      }
    }
};


module.exports = categoryCtrl;