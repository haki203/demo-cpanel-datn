const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    bookId: { type: ObjectId, ref: 'book',required:true }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    title: { type: String },
    position: { type: Number },
    chuong: { type: Number },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('mucluc', schema, 'muclucs');
