const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    userId: { type: ObjectId, ref: 'user',required:true }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    time: { type: String },
    date: { type: String },
    money: { type: Number },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('history', schema, 'hitories');
