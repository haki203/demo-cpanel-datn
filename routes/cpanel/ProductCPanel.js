var express = require('express');
var router = express.Router();
const productController = require('../../components/products/ProductController');
const productModel = require('../../components/products/ProductModel');
const uploadFile = require('../../middle/UploadFile');
const CategoryModel = require('../../components/products/CategoryModel');
const AuthorModel = require('../../components/products/AuthorModel');

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
        console.log("body ne: ",body);
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