const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    name: { type: String}, // Tiêu đề (bắt buộc phải có)
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('category', schema, 'category');
