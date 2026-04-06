require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
  // ===================== SELECT ALL =====================
  async selectAll() {
    const query = {};
    const categories = await Models.Category.find(query).exec();
    return categories;
  },

  // ===================== INSERT =====================
  async insert(category) {
    category._id = new mongoose.Types.ObjectId();
    const result = await Models.Category.create(category);
    return result;
  },

  // ===================== UPDATE =====================
  async update(category) {
    const newValues = { name: category.name };
    const result = await Models.Category.findByIdAndUpdate(
      category._id,
      newValues,
      { new: true }
    );
    return result;
  },

  // ===================== DELETE =====================
  async delete(_id) {
    const result = await Models.Category.findByIdAndDelete(_id);
    return result;
  },

  // ===================== SELECT BY ID =====================
  async selectByID(_id) {
    const category = await Models.Category.findById(_id).exec();
    return category;
  }
  // 🔹 ADD: lấy category theo _id (theo đúng yêu cầu đề bài)
};

module.exports = CategoryDAO;
