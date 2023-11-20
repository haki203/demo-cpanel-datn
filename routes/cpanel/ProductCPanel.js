var express = require('express');
var router = express.Router();
const productController = require('../../components/products/ProductController');
const productModel = require('../../components/products/ProductModel');




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
    const reports = await productModel.find({}).populate('userId', 'full_name').populate('admin', 'full_name');
    let modifiedReports = [];

    for (let i = 0; i < reports.length; i++) {
        let report = reports[i];
        
        if (report.admin == null) {
            console.log("admin null roi ong gia",i);
            report.admin = { full_name: "Chưa có ai tiếp nhận" };
        }
        
        modifiedReports.push(report);
    }
    
    console.log("new mang ne: ",modifiedReports);
    res.render('product/list', { reports });

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
    }

});


module.exports = router;