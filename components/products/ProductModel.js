const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
    title: { type: String, required: true }, // Tiêu đề (bắt buộc phải có)
    authorId: { type: ObjectId, ref: 'author' }, // Tham chiếu đến bảng Author thông qua khóa ngoại AuthorID
    categoryId: { type: ObjectId, ref: 'category' }, // Tham chiếu đến bảng Category thông qua khóa ngoại CategoryID
    description: { type: String },
    pdf: { type: String },
    image: { type: String },
    audio: { type: String,default:'https://drive.google.com/file/d/1uttPeevCI275ZZcfXOtlYL1_41HmP7JM/view?usp=sharing' },
    createAt: { type: String},
    updateAt: { type: String },
    last_search: { type: Date },
    search: { type: Number },
    publicAt: { type: Number },
    rate: { type: Number },
    free: { type: Boolean },
    disable: { type: Boolean },
    max: { type: Number },
});
// Đảm bảo rằng bảng Products chưa được định nghĩa trước đó
module.exports = mongoose.model('book', schema, 'books');
