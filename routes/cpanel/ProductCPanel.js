var express = require('express');
var router = express.Router();
const productController = require('../../components/products/ProductController');
const productModel = require('../../components/products/ProductModel');
const uploadFile = require('../../middle/UploadFile');
const CategoryModel = require('../../components/products/CategoryModel');
const AuthorModel = require('../../components/products/AuthorModel');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const MucLucModel = require('../../components/products/MucLucModel');
const AudioModel = require('../../components/products/AudioModel');
const LibraryModel = require('../../components/products/LibraryModel');
const UserModel = require('../../components/users/UserModel');
const PaymentModel = require('../../components/products/PaymentModel');
const ProductModel = require('../../components/products/ProductModel');
const upload = multer(); // Khởi tạo multer
const app = express();
app.use(express.json());
app.use(upload.none()); // Sử dụng multer để xử lý dữ liệu form
async function uploadFiles(path, filename) {
    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `/uploads/hashnode/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;
}
//localhost:3000/cpanel/product
router.get('/', async (req, res, next) => {
    const { query } = req.query;
    if (!query) {
        // hien thi ds sp
        try {
            const products = await productModel.find({}).populate('categoryId').populate('authorId');
            //console.log("product ne: ", products[0]);

            res.render('product/list', { products });
        } catch (error) {
            console.log(error);
        }
    } else {
        // hien thi kq tim kiem
        const regex = new RegExp(query, 'i');
        const products = await productModel.find({ title: { $regex: regex } }).populate('categoryId').populate('authorId');
        if (products.length < 1) {
            res.render('product/list');
        } else {
            res.render('product/list', { products: products, query: query });
        }
    }


});

router.get('/:id/delete', async (req, res, next) => {
    // hien thi trang danh sach sp
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        return res.json({ status: true })
    }
    catch (error) {
        return res.json({ status: false })
    };
});

router.get('/new', async (req, res, next) => {
    // hien thi add sp
    const categories = await CategoryModel.find({})
    const authors = await AuthorModel.find({})
    res.render('product/new', { categories, authors });

});
router.get('/download/athens', async (req, res, next) => {
    // hien thi add sp
    const categories = await CategoryModel.find({})
    const authors = await AuthorModel.find({})
    res.render('product/new', { categories, authors });

});
router.get('/author', async (req, res, next) => {
    // hien thi add sp
    console.log("author ne");
    res.render('product/author');

});
// xu ly add sp
router.post('/author', async (req, res, next) => {
    try {
        const { body } = req;
        const { name, image, introduce, career, place, } = body;
        console.log("body ne: ", body);
        const bodyNew = {
            name: name, image: image, introduce: introduce, career: career, place: place
        }
        console.log("body ne: ", bodyNew);
        const newProduct = await AuthorModel.create(bodyNew);
        if (newProduct) {
            return res.redirect('/cpanel/product');
        } else {
            return res.redirect('/error?error=ko them dc product');
        }
    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
})
router.get('/category', async (req, res, next) => {
    // hien thi add sp
    console.log("author ne");
    res.render('product/category');

});
router.get('/deleteBook/:id', async (req, res, next) => {
    // hien thi add sp
    const { id } = req.params;
    try {
        const deleteML = await MucLucModel.findOneAndDelete({ bookId: id })
        console.log(deleteML);

        const deleteAu = await AudioModel.findOneAndDelete({ bookId: id })
        console.log(deleteAu);
        const deleteBook = await productModel.findByIdAndDelete(id)
        console.log(deleteBook);
        const deleteTB = await LibraryModel.findOneAndDelete({ bookId: id })
        console.log(deleteTB);
        if (!deleteML) {
            console.log("xoa muc luc thanh cong");
        }
        if (!deleteAu) {
            console.log("xoa au thanh cong");

        }
        if (!deleteBook) {
            console.log("xoa book thanh cong");

        }
        if (!deleteTB) {
            console.log("xoa thu vien thanh cong");

        }
    } catch (error) {
        console.log(error);
    }
    return res.status(200).json({ result: false, message: 'xoa thanh conng' });

});
router.post('/category', async (req, res, next) => {
    try {
        const { body } = req;
        const { name } = body;
        console.log("body ne: ", body);
        const bodyNew = {
            name: name
        }
        console.log("body ne: ", bodyNew);
        const newProduct = await CategoryModel.find({ name: bodyNew.name });
        if (newProduct) {
            return res.redirect('/error?error=Danh mục này đã có roi!');
        } else {
            const newProducts = await CategoryModel.create(bodyNew);
            if (newProducts) {
                return res.redirect('/cpanel/product');
            } else {
                return res.redirect('/error?error=ko them dc product');
            }
        }

    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
})
//xu ly cap nhat sp
// const product = await productModel.findByIdAndUpdate(id,
//     { title: title, description: description, pdf: pdf, image: image, audio: audio, categoryId: category, authorId: author, publicAt: publicAt })
router.post('/:id/edit', [uploadFile.single('image'),], async (req, res, next) => {
    const updateAt = moment().add(7, 'hours').format('DD-MM-YYYY');
    try {
        const { id } = req.params;
        const { body } = req;
        const { title, image, description, publicAt, category, author, pdf, audio, mucluc, free, max } = body;
        if (!title || !image || !description || !publicAt || !category || !author || !pdf || !audio || !mucluc || !max || !free) {
            return res.status(200).json({ result: false, message: 'update ko thanh cong,thieu thong tin' });
        }
        let freeNe = Boolean(true);
        if (free == "free") {
        } else {
            freeNe = Boolean(false);
        }
        // Mảng mới để lưu audio
        var audios = audio.split(',');
        console.log(audios[0]);
        console.log(audios[1]);
        console.log(audios[2]);
        console.log(audios[3]);

        // Mảng mới để lưu mucluc
        var mls = mucluc.split(',');
        console.log(mls[0]);
        console.log(mls[1]);
        console.log(mls[2]);
        console.log("position 1: ", mls[3]);
        console.log("position 2: ", mls[4]);
        console.log("position 3: ", mls[5]);

        const product = await productModel.findByIdAndUpdate(id,
            {
                title: title, description: description
                , pdf: pdf, image: image
                , categoryId: category, authorId: author
                , publicAt: publicAt, free: free, max: parseInt(max)
            })
        if (product) {
            //update sach thanh cong
            const audioUpdate = await AudioModel.findOneAndUpdate({ bookId: id }, { audio0: audios[0], audio1: audios[1], audio2: audios[2], audio3: audios[3] });
            //const audioUpdates = await AudioModel.find({ bookId: id })
            if (audioUpdate.length < 1) {
                // update that bai
            } else {
                //update audio thanh cong, tiep tuc update mucluc
                const mlUpdate1 = await MucLucModel.findOneAndUpdate({ bookId: id, chuong: 1 }, { title: mls[0], position: mls[3] });
                const mlUpdate2 = await MucLucModel.findOneAndUpdate({ bookId: id, chuong: 2 }, { title: mls[1], position: mls[4] });
                const mlUpdate3 = await MucLucModel.findOneAndUpdate({ bookId: id, chuong: 3 }, { title: mls[2], position: mls[5] });

                if (mlUpdate1.length < 1 || mlUpdate2.length < 1 || mlUpdate3.length < 1) {
                    //update that bai
                } else {
                    return res.redirect('/cpanel/product?alert=update%20thanh%20cong');

                }

            }
        } else {
            return res.redirect('/error?error=ko update dc product');
        }


    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
});
function formatNumber(number) {
    // Chuyển đổi số thành chuỗi
    let numberString = number.toString();
    // Tính độ dài của số
    let length = numberString.length;
    // Tạo một biến lưu trữ kết quả
    let result = '';
    // Duyệt qua từng ký tự của chuỗi số (từ phải sang trái)
    for (let i = length - 1; i >= 0; i--) {
        // Thêm ký tự vào kết quả
        result = numberString[i] + result;
        // Nếu đã duyệt qua 3 ký tự và không phải là ký tự cuối cùng, thêm dấu chấm
        if ((length - i) % 3 === 0 && i !== 0) {
            result = '.' + result;
        }
    }
    return result;
}
router.get('/doanhthu/get', async (req, res) => {
    try {
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let doanhthu = await PaymentModel.find({})
        if (doanhthu) {
            let doanhthuNe = 0;
            for (let i = 0; i < doanhthu.length; i++) {
                doanhthuNe += parseInt(doanhthu[i].money);
            }
            console.log(doanhthuNe);
            console.log(formatNumber(doanhthuNe));
            res.status(200).json({ result: true, doanhthu: formatNumber(doanhthuNe) });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }

    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
const mongoose = require('mongoose');

router.get('/doanhthu/get-all', async (req, res) => {

    try {
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let doanhthu = await PaymentModel.find({})
        let history=[];

        if (doanhthu) {
            for (let i = 0; i < doanhthu.length; i++) {
                // Kết hợp thời gian và ngày thành chuỗi đầy đủ
                const historyDateTimeString = `${doanhthu[i].date} ${doanhthu[i].time}`;
                // Chuyển đổi thành đối tượng moment
                const historyMoment = moment(historyDateTimeString, "DD/MM/YYYY hh:mm A");
                // Thời gian hiện tại
                const currentMoment = moment().add(7, 'hours');
                // Tính khoảng cách thời gian giữa history và thời gian hiện tại
                const minutesDifference = currentMoment.diff(historyMoment, 'minutes');
                // Tính khoảng cách thời gian giữa history và thời gian hiện tại
                const duration = moment.duration(currentMoment.diff(historyMoment));
                // Lấy số lượng giờ, ngày, tuần và tháng
                const hoursDifference = duration.asHours();
                const daysDifference = duration.asDays();
                let idUser = doanhthu[i].userId.toString();
                const userNe = await UserModel.findById(idUser)
                let bodyNe={};
                if (minutesDifference < 61) {
                     bodyNe = { message: userNe.full_name + " đã thanh toán hội viên giá " + doanhthu[i].money + ".000 VND", date: minutesDifference+" phút trước!" }
                }else if(hoursDifference<25){
                     bodyNe = { message: userNe.full_name + " đã thanh toán hội viên giá " + doanhthu[i].money + ".000 VND", date: hoursDifference+" giờ trước!" }
                }else{
                     bodyNe = { message: userNe.full_name + " đã thanh toán hội viên giá " + doanhthu[i].money + ".000 VND", date: daysDifference+" ngày trước!" }
                }
                history.push(bodyNe)
            }


            res.status(200).json({
                result: true, history: history
            });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }

    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
router.get('/get-sum/book', async (req, res) => {
    try {
        // Kiểm tra xem email đã tồn tại trong MongoDB chưa
        let doanhthu = await ProductModel.find({})
        if (doanhthu) {
            let sumDisable = 0;
            for (let i = 0; i < doanhthu.length; i++) {
                if (doanhthu[i].disable) {
                    sumDisable += 1;
                }
            }
            res.status(200).json({ result: true, product: doanhthu.length, productDisable: sumDisable });
        }
        else {
            res.status(200).json({ result: false, message: "khong co user" });
        }
    } catch (error) {
        res.status(201).json({ result: false, message: 'Internal Server Error' + error });
    }
});
//xu ly add
router.post('/new', async (req, res, next) => {

    const createAt = moment().add(7, 'hours').format('DD-MM-YYYY');
    const updateAt = moment().add(7, 'hours').format('DD-MM-YYYY');
    try {
        const { body } = req;
        const { title, image, description, publicAt, category, author, pdf, audio, mucluc, free, max } = body;
        if (!title || !image || !description || !publicAt || !category || !author || !pdf || !audio || !mucluc || !max || !free) {
            return res.status(200).json({ result: false, message: 'update ko thanh cong,thieu thong tin' });
        }
        let freeNe = Boolean(true);
        if (free == "free") {
        } else {
            freeNe = Boolean(false);
        }
        // Mảng mới để lưu audio
        var audios = audio.split(',');
        console.log(audios[0]);
        console.log(audios[1]);
        console.log(audios[2]);
        console.log(audios[3]);

        // Mảng mới để lưu mucluc
        var mls = mucluc.split(',');
        console.log(mls[0]);
        console.log(mls[1]);
        console.log(mls[2]);
        console.log("position 1: ", mls[3]);
        console.log("position 2: ", mls[4]);
        console.log("position 3: ", mls[5]);
        //return res.status(200).json({ result: true, message: 'update  thanh cong' });
        //thieu ,disable,free,max 
        const last_search = new Date();
        const rate = 0;
        const search = 1;
        const bodyNew = {
            title: title, authorId: author, categoryId: category, description: description, disable: false, free: free, max: max,
            image: image, createAt: createAt, updateAt: updateAt, pdf: pdf, last_search: last_search, rate: rate, search: search, publicAt: publicAt
        }
        //neu ch co sach thi moi them sach
        const getBook = await productModel.find({ title: title });
        if (getBook.length < 1) {
            const newProduct = await productModel.create(bodyNew);
            //neu them thanh cong thi them mucluc
            if (newProduct) {
                const newML1 = { bookId: newProduct._id, title: mls[0], position: mls[3], chuong: 1 }
                const newML2 = { bookId: newProduct._id, title: mls[1], position: mls[4], chuong: 2 }
                const newML3 = { bookId: newProduct._id, title: mls[2], position: mls[5], chuong: 3 }
                const ml1 = await MucLucModel.create(newML1)
                const ml2 = await MucLucModel.create(newML2)
                const ml3 = await MucLucModel.create(newML3)
                // neu them mucluc thanh cong thi them audio
                if (ml1 && ml2 && ml3) {
                    const newAu = { bookId: newProduct._id, audio0: audios[0], audio1: audios[1], audio2: audios[2], audio3: audios[3] };
                    const newAudio = await AudioModel.create(newAu)
                    if (newAudio) {
                        return res.redirect('/cpanel/product');
                    }
                    else {
                        const deleteMl = await MucLucModel.findOneAndDelete({ bookId: newProduct._id });
                        console.log(deleteMl);
                        return res.redirect('/error?error=ko them dc product');
                    }
                } else {
                    const deleteNe = await productModel.findByIdAndRemove(newProduct._id);
                    console.log(deleteNe);
                    return res.redirect('/error?error=ko them dc product');
                }
            } else {
                return res.redirect('/error?error=ko them dc product');
            }
        } else {
            return res.redirect('/error?error=sach nay da co roi');
        }

        // console.log("body ne: ", bodyNew);

        // const newProduct = await productModel.create(bodyNew);
        // if (newProduct) {
        //     return res.redirect('/cpanel/product');
        // } else {
        //     return res.redirect('/error?error=ko them dc product');
        // }

    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
})
// hien thi trang cap nhat sp /cpanel/product/:id/edit
router.get('/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        //const product = await productController.getProductById(id);
        const product = await productModel.findById(id);
        const categories = await CategoryModel.find({})
        const audios = await AudioModel.find({ bookId: id })
        const audioArray = audios[0].audio0 + "," + audios[0].audio1 + "," + audios[0].audio2 + "," + audios[0].audio3;
        const authors = await AuthorModel.find({});
        const mls = await MucLucModel.find({ bookId: id })
        const muclucs = mls[0].title + "," + mls[1].title + "," + mls[2].title + "," + mls[0].position + "," + mls[1].position + "," + mls[2].position;
        console.log("max ne: ", product.max);
        //console.log("audio ne: ",audioArray);
        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
            //console.log("element ne: ", element);
            categories[index].selected = false;
            if (element._id.toString() == product.categoryId.toString()) {
                categories[index].selected = true;
            }
        }
        for (let index = 0; index < authors.length; index++) {
            const element = authors[index];
            //console.log("element ne: ", element);
            authors[index].selected = false;
            if (element._id.toString() == product.authorId.toString()) {
                authors[index].selected = true;
            }
        }
        res.render('product/edit', { product, categories, authors, audioArray, muclucs });
    } catch (error) {
        next(error);
    }
});



module.exports = router;