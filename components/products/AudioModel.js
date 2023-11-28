const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    bookId: { type: ObjectId, ref: 'book',required:true }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    audio1: { type: String },
    audio0: { type: String },
    audio2: { type: String },
    audio3: { type: String },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('audio', schema, 'audios');
