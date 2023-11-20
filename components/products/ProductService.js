const productModel = require('./ProductModel');
const unorm = require('unorm');
const getAllProducts = async (size, page) => {
    // lay toan bo sp trong database
    // size =20 , page =4 ==> 61-80
    try {
        const books = await productModel.find({});
        return books;
    } catch (error) {
        console.log("getAllProducts error: " + error);
        throw error;
        return [];
    }

}
const getAllDetails = async (size, page) => {
    // lay toan bo sp trong database
    // size =20 , page =4 ==> 61-80
    try {
        return await detailModel.find()
    } catch (error) {
        console.log("getAllProducts error: " + error);
    }
    return [];
}
const deleteProductById = async (id) => {

    try {
        await productModel.findByIdAndDelete(id);
        return true;
    }
    catch (error) {
        console.log("Delete product by ID error: " + error);
        throw error;
    }
    return false;

}
const addNewProduct = async (title, authorId, categoryId, description, image, createAt, updateAt) => {
    try {
        const newProduct = {
            title, authorId, categoryId, description, image, createAt, updateAt
        }
        await productModel.create(newProduct);
        return true;
    }
    catch (error) {
        console.log("addNewProduct error: " + error);
        throw error;
    }
    return false;

}
//update sp
const updateProduct = async (id, name, author, content, price, image, category) => {
    try {
        let item = await productModel.findById(id);
        if (item) {
            item.name = name ? name : item.name;
            item.author = author ? author : item.author;
            item.content = content ? content : item.content;
            item.image = image ? image : item.image;
            item.category = category ? category : item.category;
            item.detail = detail ? detail : item.detail;
            await item.save();
            return true;
        }
    } catch (error) {
        console.log('Update product error', error);

    }
    return false;
}
// lay thong tin sp theo id
//
const getProductById = async (id) => {
    try {
        let product = await productModel.findById(id)
        return product;
    } catch (error) {
        console.log('getProductById error', error);
    }
    return null;
}
const removeDiacritics = require('diacritics').remove; // Import thư viện diacritics

const search = async (keyword) => {
    try {
        // Lấy tất cả sản phẩm từ cơ sở dữ liệu
        const products = await productModel.find();

        // Chuẩn hóa từ khóa tìm kiếm
        const normalizedKeyword = removeDiacritics(keyword).toLowerCase();

        // Dùng mảng để lưu trữ kết quả
        const results = [];

        // Lặp qua danh sách sản phẩm và so sánh
        products.forEach((product) => {
            const normalizedTitle = removeDiacritics(product.title).toLowerCase();

            if (normalizedTitle.includes(normalizedKeyword)) {
                results.push(product);
            }
        });

        return results;
    } catch (error) {
        console.log('search error', error);
    }
}



module.exports = { getAllProducts, getProductById, search };
