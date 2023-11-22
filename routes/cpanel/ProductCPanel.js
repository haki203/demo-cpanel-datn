var express = require('express');
var router = express.Router();
const productController = require('../../components/products/ProductController');
const productModel = require('../../components/products/ProductModel');
const uploadFile = require('../../middle/UploadFile');

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
    const products = await productModel.find({})
    res.render('product/list', { products });
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
        let { body, file } = req;
        let { id } = req.params;
        if (file) {
            let image = `http://${CONFIG.CONSTANTS.IP}:3000/images/${file.filename}`;
            body = { ...body, image: image }
        }
        let { name, price, quantity, image, category } = body;
        console.log(body);
        await productController
            .updateProduct(id, name, price, quantity, image, category);
        return res.redirect('/cpanel/product');
    } catch (error) {
        console.log('Add new product error: ', error)
        next(error);
    }
});

// hien thi trang cap nhat sp /cpanel/product/:id/edit
router.get('/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productController.getProductById(id);
        const categories = await categoryController.getAllCategories();
        console.log(product);
        console.log(categories);
        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
            categories[index].selected = false;
            if (element._id.toString() == product.category.toString()) {
                categories[index].selected = true;
            }
        }
        res.render('product/edit', { product, categories });
    } catch (error) {
        next(error);
    }
});



module.exports = router;