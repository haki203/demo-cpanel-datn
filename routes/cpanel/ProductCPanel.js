var express = require('express');
var router = express.Router();
const productController = require('../../components/products/ProductController');
const productModel = require('../../components/products/ProductModel');
const uploadFile = require('../../middle/UploadFile');
const CategoryModel = require('../../components/products/CategoryModel');
const AuthorModel = require('../../components/products/AuthorModel');
const moment = require('moment');
const multer = require('multer');
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
    //hien thi trang danh sach sp
    try {
        const products = await productModel.find({}).populate('categoryId').populate('authorId');
        //console.log("product ne: ", products[0]);

        res.render('product/list', { products });
    } catch (error) {
        console.log(error);
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
//xu ly cap nhat sp
router.post('/:id/edit', [uploadFile.single('image'),], async (req, res, next) => {
    try {
        const { body } = req;
        const { id } = req.params;

        const { title, description, pdf, image, audio, category, author, publicAt } = body;
        console.log("body ne: ", body);
        const product = await productModel.findByIdAndUpdate(id,
            { title: title, description: description, pdf: pdf, image: image, audio: audio, categoryId: category, authorId: author, publicAt: publicAt })
        if (product) {
            //console.log("product sau khi cap nhat ne: ", product);
            return res.redirect('/cpanel/product?successful=true');
        } else {
            return res.redirect('/cpanel/product?error=invalid');
        }
    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
});
router.get('/new', async (req, res, next) => {
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

        const { name,image,introduce,career,place, } = body;
        console.log("body ne: ", body);


        const bodyNew = {
            name:name,image:image,introduce:introduce,career:career,place:place
        }
        console.log("body ne: ", bodyNew);

        const newProduct = await AuthorModel.create(bodyNew);
        if(newProduct){
            return res.redirect('/cpanel/product');
        }else{
            return res.redirect('/error?error=ko them dc product');
        }

    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
})
router.post('/new', async (req, res, next) => {

    const createAt = moment().add(7, 'hours').format('DD-MM-YYYY');
    const updateAt = moment().add(7, 'hours').format('DD-MM-YYYY');
    try {
        const { body } = req;

        const { title, image, description, publicAt, category, author, pdf, audio } = body;
        console.log("body ne: ", body);

        const last_search = new Date();
        const rate = 0;
        const search = 1;
        const bodyNew = {
            title: title, authorId: author, categoryId: category, description: description,
            image: image, createAt: createAt, updateAt: updateAt, pdf: pdf, audio: audio, last_search: last_search, rate: rate, search: search, publicAt: publicAt
        }
        console.log("body ne: ", bodyNew);

        const newProduct = await productModel.create(bodyNew);
        if(newProduct){
            return res.redirect('/cpanel/product');
        }else{
            return res.redirect('/error?error=ko them dc product');
        }

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
        const authors = await AuthorModel.find({});
        console.log(authors);
        console.log(product);
        console.log(categories);
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
        res.render('product/edit', { product, categories, authors });
    } catch (error) {
        next(error);
    }
});



module.exports = router;