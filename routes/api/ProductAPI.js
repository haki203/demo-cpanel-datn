var express = require('express');
var router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const productModel = require('../../components/products/ProductModel');
const authorModel = require('../../components/products/AuthorModel');
const commentModel = require('../../components/products/CommentModel');
const categoryModel = require('../../components/products/CategoryModel');
const productController = require('../../components/products/ProductController');
const UploadFile = require('../../middle/UploadFile');
const favouriteModel = require('../../components/products/FavouriteModel');
const userModel = require('../../components/users/UserModel');
const MucLucModel = require('../../components/products/MucLucModel');
const LibraryModel = require('../../components/products/LibraryModel');
const AudioModel = require('../../components/products/AudioModel');
//api/product
router.get('/', async (req, res, next) => {
    try {
        const product = await productModel.find({});
        res.status(200).json({ product, result: true });

        // const updateResult = await productModel.updateMany(
        //     {},
        //     {
        //         $set: {
        //             disable: false, // Thay đổi tên cột mới và giá trị mặc định của bạn
        //         },
        //     }
        // );
        // res.status(200).json({ updateResult, result: true });
    } catch (error) {
        res.status(201).json({});
    }
});
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await productController.getProductById(id);
        res.status(200).json({ product, result: true });
    } catch (error) {
        res.status(201).json({});
    }
});
// get author by id
router.get('/author/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log(id);
        const author = await authorModel.findById(id);
        res.status(200).json({ author, result: true });
    } catch (error) {
        res.status(201).json({ result: false, error });
    }
});
// get author by id
router.post('/disable/change', async (req, res, next) => {
    const { id, disable } = req.body;
    try {
        console.log("disable ne: ", disable);
        const author = await productModel.findByIdAndUpdate(id, { disable: disable });
        res.status(200).json({ author, result: true });
    } catch (error) {
        res.status(201).json({ result: false, error });
    }
});
// get book by id authior
router.get('/get-book-by-author/:id', async (req, res, next) => {
    const { id } = req.params;
    let ids = new mongoose.Types.ObjectId(id);
    console.log(ids);
    try {

        const products = await productModel.find({ authorId: ids });
        if (products) {
            res.status(200).json({ products, result: true });
        } else {
            res.status(200).json({ result: false });
        }
    } catch (error) {
        res.status(200).json({ result: false, error });
    }
});
//add favourite
router.post('/favourite/new', async (req, res, next) => {
    const { idUser, idBook } = req.body;
    try {
        if (!idUser || !idBook) {
            return res.status(200).json({ result: false, message: "Thieu thong tin" });
        }
        else {
            const allFavourites = await favouriteModel.find({});
            for (let i = 0; i < allFavourites.length; i++) {
                if (allFavourites[i].bookId == idBook && allFavourites[i].userId == idUser) {
                    const favouriteDelete = await favouriteModel.findByIdAndDelete(allFavourites[i]._id);
                    if (favouriteDelete) {
                        console.log(allFavourites[i]._id);
                        return res.status(200).json({ message: "huy yeu thich thanh cong", result: true });
                    }
                }
            }
            const fa = { bookId: idBook, userId: idUser }
            const favourite = await favouriteModel.create(fa);
            if (favourite) {
                return res.status(200).json({ result: true, message: "yeu thich thanh cong" });
            } else {
                return res.status(201).json({ result: false });
            }
        }
    } catch (error) {
        return res.status(200).json({ result: false, error });
    }
});
router.get('/favourite/delete/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(200).json({ result: false, message: "Thieu thong tin" });
        }
        else {
            const favourite = await favouriteModel.findByIdAndDelete(id);

            if (favourite) {
                return res.status(200).json({ result: true, message: "xoa thanh cong" });
            } else {
                return res.status(200).json({ result: false, message: "ko tim thay id" });
            }
        }
    } catch (error) {
        return res.status(200).json({ result: false, error });
    }
});
// get all favourite by id user
router.get('/favourite/get-book-by-user/:idUser', async (req, res, next) => {
    const { idUser } = req.params;
    try {
        if (!idUser) {
            return res.status(201).json({ result: false, message: "Thieu thong tin" });
        }
        else {
            const userFavourites = await favouriteModel.find({ userId: idUser });
            if (userFavourites.length > 0) {
                let data = [];
                for (let i = 0; i < userFavourites.length; i++) {
                    const booksNe = await productModel.findById(userFavourites[i].bookId);
                    let favourites = { favourite: userFavourites[i], book: booksNe }
                    data.push(favourites);
                }
                return res.status(200).json({ result: true, data });
            } else {
                return res.status(200).json({ result: true, data: [] });
            }
        }
    } catch (error) {
        return res.status(200).json({ result: false, message: error + idUser });
    }
});
// get category
router.get('/category/getAlls', async (req, res, next) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).json({ category, result: true });
    } catch (error) {
        res.status(201).json({});
    }
});
// get category by id
router.get('/category/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await categoryModel.findById(id);
        res.status(200).json({ category, result: true });
    } catch (error) {
        res.status(201).json({});
    }
});
// get category by id
router.post('/pdf/update', async (req, res, next) => {
    const { id, newPdf } = req.body;
    try {
        if (!id || !newPdf) {
            res.status(201).json({ result: false, message: 'thieu thong tin' });
        } else {
            const pdfd = await productModel.findByIdAndUpdate(id, { pdf: newPdf });
            if (pdfd) {
                const pdf = await productModel.findById(id);
                res.status(200).json({ pdf, result: true });
            } else {
                res.status(201).json({ result: false, pdf });
            }
        }
    } catch (error) {
        res.status(201).json({ result: false, message: "" + error });
    }
});
// get all product by category
router.get('/get-by-category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        // Truy vấn cơ sở dữ liệu để lấy các sản phẩm có categoryId tương ứng
        const product = await productModel.find({ categoryId });
        if (product) {
            res.status(200).json({ result: true, product });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.get('/authors/getAll', async (req, res) => {
    try {
        const authors = await authorModel.find({});
        if (authors) {
            res.status(200).json({ result: true, authors });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.post('/add-muc-luc', async (req, res) => {
    try {
        const { bookId, title1, position1, title2, position2, title3, position3 } = req.body;
        const newML1 = { bookId: bookId, title: title1, position: position1, chuong: 1 }
        const newML2 = { bookId: bookId, title: title2, position: position2, chuong: 2 }
        const newML3 = { bookId: bookId, title: title3, position: position3, chuong: 3 }
        const book = await MucLucModel.find({ bookId: bookId })
        let resultUpdate = [];
        let isUpdate = false;
        for (let i = 0; i < book.length; i++) {
            if (book[i].chuong == 1) {
                const newBook = await MucLucModel.findByIdAndUpdate(book[i]._id, { title: title1, position: position1 })
                if (newBook) {
                    //res.status(200).json({ result: true, ml: newBook, message: 'update chuong1 thanh cong' });
                    resultUpdate.push('update chuong1 thanh cong')
                }
                isUpdate = true;
            }
            if (book[i].chuong == 2) {
                const newBook = await MucLucModel.findByIdAndUpdate(book[i]._id, { title: title2, position: position2 })
                if (newBook) {
                    //res.status(200).json({ result: true, ml: newBook, message: 'update chuong2 thanh cong' });
                    resultUpdate.push('update chuong2 thanh cong')

                }
                isUpdate = true;

            }
            if (book[i].chuong == 3) {
                const newBook = await MucLucModel.findByIdAndUpdate(book[i]._id, { title: title3, position: position3 })
                if (newBook) {
                    //res.status(200).json({ result: true, ml: newBook, message: 'update thanh cong' });
                    resultUpdate.push('update chuong3 thanh cong')

                }
                isUpdate = true;

            }

        }
        if (!isUpdate) {
            const ml1 = await MucLucModel.create(newML1)
            const ml2 = await MucLucModel.create(newML2)
            const ml3 = await MucLucModel.create(newML3)
            return res.status(200).json({ result: true, message: 'them thanh cong', ml1, ml2, ml3 });

        }
        return res.status(200).json({ result: true, message: resultUpdate });



    } catch (err) {
        return res.status(201).json({ error: 'Đã có lỗi xảy ra ', err });
    }
});
router.post('/audio/new', async (req, res) => {
    try {
        const { bookId, audio0, audio1, audio2, audio3 } = req.body;
        const newAu = { bookId, audio0, audio1, audio2, audio3 };
        const book = await AudioModel.findOne({ bookId: bookId })
        if (book) {
            const newBook = await AudioModel.findOneAndUpdate({ bookId: bookId }, { audio0: audio0, audio1: audio1, audio2: audio2, audio3: audio3 });
            if (newBook) {
                return res.status(200).json({ result: true, message: 'update thanh cong', newBook });
            } else {
                return res.status(200).json({ result: false, message: 'update ko thanh cong', newBook });
            }
        } else {
            const newAudio = await AudioModel.create(newAu)
            if (newAudio) {
                return res.status(200).json({ result: true, message: 'them thanh cong', newAudio });
            } else {
                return res.status(200).json({ result: false, message: 'them ko thanh cong', newAudio });
            }
        }
    } catch (error) {
        return res.status(200).json({ message: error });
    }
});

router.get('/get-muc-luc/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ml = await MucLucModel.find({ bookId: id })
        console.log(id);
        if (ml) {
            res.status(200).json({ result: true, ml });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.get('/get-audio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const audios = await AudioModel.find({ bookId: id })
        console.log(id);
        if (audios) {
            res.status(200).json({ result: true, audios });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.post('/nameBook/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(200).json({ result: false, message: 'thieu thong tin' });

        }
        const ml = await productModel.findOne({ title: { $regex: new RegExp(name, 'i') } });
        if (ml) {
            return res.status(200).json({ result: true, ml });
        }
        else {
            return res.status(201).json({ result: false, message: "k co sach nay" });
        }
    } catch (err) {
        return res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
// lay thu vien
// router.get('/library/:idUser', async (req, res) => {
//     try {
//         const { idUser } = req.params;
//         const ml = await LibraryModel.find({ userId: idUser })

//         if (ml) {
//             res.status(200).json({ result: true, ml });
//         }
//         else {
//             res.status(201).json({ result: false });
//         }
//     } catch (err) {
//         res.status(201).json({ error: 'Đã có lỗi xảy ra' });
//     }
// });
router.post('/continue/getProgress', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const book = await LibraryModel.find({ bookId: bookId, userId: userId })

        if (book) {
            res.status(200).json({ result: true, book });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.post('/continue/newLibrary', async (req, res) => {
    try {
        const { userId, bookId, index } = req.body;
        const get = await productModel.findById(bookId)
        const old = await LibraryModel.find({ userId: userId, bookId: bookId })
        if (old) {

        } else {

            console.log(get.max);
            const book = await LibraryModel.find({ bookId: bookId, userId: userId })
            if (book.length > 0) {
                res.status(200).json({ result: false, book });
            }
            else {
                const progressNew = Math.round((index / get.max) * 100);
                const body = { userId: userId, bookId: bookId, max: get.max, index: index, progress: progressNew };
                const book = await LibraryModel.create(body);
                res.status(200).json({ result: true, book });
            }
        }

    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.post('/library/updateProgress', async (req, res) => {
    try {
        const { userId, bookId, newIndex } = req.body;
        if (!userId || !bookId || !newIndex) {
            return res.status(200).json({ result: false, message: 'thieu thong tin' });
        }
        const bookData = await LibraryModel.find({ bookId: bookId, userId: userId })
        if (newIndex > bookData.max) {
            return res.status(201).json({ result: false });
        }
        const newProgress = Math.round((newIndex / bookData[0].max) * 100);
        const books = await LibraryModel.findOneAndUpdate(
            { userId, bookId },
            { $set: { index: newIndex, progress: newProgress } }
        );
        if (books) {
            const book = await LibraryModel.find({ bookId: bookId, userId: userId })
            return res.status(200).json({ result: true, book, message: 'update thanh cong' });
        }
        else {
            return res.status(200).json({ result: false });
        }
    } catch (err) {
        return res.status(201).json({ error: 'Đã có lỗi xảy ra', err });
    }
});
// them thu vien

router.post('/library/add', async (req, res) => {
    try {
        const { user, book, max, index } = req.body;

        const all = await LibraryModel.find({})

        for (let i = 0; i < all.length; i++) {
            if (all[i].userId == user && all[i].bookId == book) {
                const progress = Math.round((all[i].index / all[i].max) * 100);;
                const librarys = await LibraryModel.findByIdAndUpdate(all[i]._id, { index: index, progress: progress })
                return res.status(200).json({ result: true, library: librarys, message: "update thanh cong" });
            }
        }
        const progressNew = Math.round((index / max) * 100);
        const body = { userId: user, bookId: book, max: max, index: index, progress: progressNew }
        const library = await LibraryModel.create(body);
        if (library) {
            res.status(200).json({ result: true, library, message: "them thanh cong" });
        }
        else {
            res.status(201).json({ result: false });
        }
    } catch (err) {
        res.status(201).json({ error: 'Đã có lỗi xảy ra', err });
    }
});
router.get('/library/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const library = await LibraryModel.find({ userId: id })
        if (library) {
            return res.status(200).json({ result: true, library });
        }
        else {
            return res.status(201).json({ result: false });
        }
    } catch (err) {
        return res.status(201).json({ error: 'Đã có lỗi xảy ra' });
    }
});
router.post('/comment/new', async (req, res) => {
    try {
        const { userId, bookId, title, content, rate } = req.body;
        const time = moment().add(7, 'hours').format('hh:mm A');
        const date = moment().add(7, 'hours').format('DD/MM/YYYY');

        if (!userId || !bookId || !title || !content || !rate) {
            res.status(201).json({ result: false, message: "Thiếu thông tin" });
        } else {
            const newCmt = {
                time: time,
                userId: userId,
                bookId: bookId,
                content: content,
                rate: rate,
                date: date,
                title: title,
            };

            const comment = await commentModel.create(newCmt);
            if (comment) {
                res.status(200).json({ result: true, comment });
            }
            else {
                res.status(201).json({ result: false });
            }
        }
    } catch (err) {
        res.status(500).json({ result: false, error: 'Đã có lỗi xảy ra' + err });
    }
});
router.get('/comment/get-by-id/:bookId', async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const comment = await commentModel.find({});
        let comments = [];
        if (comment) {
            for (let i = 0; i < comment.length; i++) {
                if (comment[i].bookId.toString() == bookId) {
                    const book = await productModel.findById(comment[i].bookId);
                    const user = await userModel.findById(comment[i].userId);
                    let cmt = {
                        _id: comment[i]._id,
                        time: comment[i].time,
                        user: user,
                        book: book,
                        content: comment[i].content,
                        title: comment[i].title,
                        likeBy: comment[i].likeBy,
                        date: comment[i].date,
                        rate: comment[i].rate,
                    }
                    comments.push(cmt);
                }
                else {
                }
            }
            return res.status(200).json({ comments, result: true });
        } else {
            res.status(201).json({ result: false });
        }

    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
// add sp
router.post('/', async (req, res, next) => {

    try {
        const { name, price, quantity, image, category } = req.body;
        await productController.addNewProduct(name, price, quantity, image, category);
        res.status(200).json({ result: true });
    } catch (error) {
        res.status(201).json({ result: false });
    }
});
//api/product/search/name?keyword=iphone
router.get('/search/name', async (req, res, next) => {
    try {
        const { keyword } = req.query;
        console.log(keyword);
        const product = await productController.search(keyword);
        return res.status(200).json({ product, result: true });
    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
router.get('/search/recent', async (req, res, next) => {
    try {
        const products = await productModel.find({});
        products.sort((a, b) => b.last_search - a.last_search);

        // Lấy ra 5 sản phẩm đầu tiên
        const top5Products = products.slice(0, 5);
        return res.status(200).json({ top5Products, result: true });
    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
router.get('/search/select/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const now = new Date();
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                $inc: { search: 1 }, // Cộng thêm 1 cho trường search
                last_search: now,     // Cập nhật trường last_search thành thời gian hiện tại
            },
            { new: false } // Tùy chọn này để nhận lại sản phẩm đã được cập nhật
        );

        // Lấy ra 5 sản phẩm đầu tiên
        return res.status(200).json({ result: true });
    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
router.get('/add/new', async (req, res, next) => {
    try {
        // Sử dụng Mongoose để thực hiện cập nhật cho tất cả tài liệu
        let date = new Date();

        const updateResult = await productModel.updateMany(
            {},
            {
                $set: {
                    publicAt: date, // Thay đổi tên cột mới và giá trị mặc định của bạn
                },
            }
        );

        res.status(200).json({
            result: true,
            updateResult
        });
    } catch (error) {
        res.status(201).json({ result: false, message: 'Lỗi khi cập nhật cột mới.' });
    }
});
router.get('/relate/:id', async (req, res, next) => {
    const id = req.params;
    try {
        console.log(id);
        //const product = await productModel.find({ categoryId: categoryIdObjectId  }).exec();
        return res.status(200).json({ product, result: true });
    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
router.post('/public/year', async (req, res, next) => {
    const { id, date } = req.body;
    try {
        const product = await productModel.findByIdAndUpdate(id, { publicAt: date })
        return res.status(200).json({ product, result: true });
    } catch (error) {
        console.log("api search error: " + error);
        res.status(201).json({ result: false });
    }
});
//upload hinh len sever
//api/product/upload
router.post('/upload', [UploadFile.single('image')], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(201).json({ result: false });
        }
        else {
            const url = `http://172.16.87.39:3000/images/${file.filename}`;
            return res.status(200).json({ result: true, url });
        }
    } catch (error) {
        console.log("upload error: " + error);
        res.status(201).json({});
    }
});
//api/product/get-all-products
router.get('/get-all-products', [UploadFile.single('image')], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(201).json({ result: false });
        }
        else {
            const url = `http://172.16.87.39:3000/images/${file.filename}`;
            return res.status(200).json({ result: true, url });
        }
    } catch (error) {
        console.log("upload error: " + error);
        res.status(201).json({});
    }
});
module.exports = router;