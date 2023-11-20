const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    time: { type: String, required: true }, // Tiêu đề (bắt buộc phải có)
    userId: { type: ObjectId, ref: 'users' }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    bookId: { type: ObjectId, ref: 'books' }, // Tham chiếu đến bảng Category thông qua khóa ngoại CategoryID
    content: { type: String },
    title: { type: String },
    likeBy: { type: String,default:"" },
    date: { type: String },
    rate: { type: Number },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('comment', schema, 'comments');
