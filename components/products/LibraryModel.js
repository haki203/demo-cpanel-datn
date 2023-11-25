const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    bookId: { type: ObjectId, ref: 'book',required:true }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    userId: { type: ObjectId, ref: 'user',required:true }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    max: { type: Number,required:true  },
    progress: { type: Number ,},
    index: { type: Number ,required:true },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('library', schema, 'librarys');
