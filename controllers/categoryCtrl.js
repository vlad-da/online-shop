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
    },
    deleteCategory: async (req, res) => {
      try {
          await Category.findByIdAndDelete(req.params.id);
          res.json({msg: "Deleted a Category"});
      } catch (err) {
          return res.status(500).json({msg: err.message});
      }
    },
    updateCategory: async (req, res) => {
      try {
          const {name} = req.body;
          await Category.findOneAndUpdate({_od: req.params.id}, {name});

          res.json({msg: "Updated a category"});
      } catch (err) {
          return res.status(500).json({msg: err.message});
      }
    }
};


module.exports = categoryCtrl;