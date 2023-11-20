const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    name: { type: String },
    image: { type: String },
    place: { type: String },
    introduce: { type: String },
    career: { type: String },

});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('author', schema, 'authors');
