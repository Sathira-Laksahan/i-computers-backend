import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {
    try {

        if (isAdmin(req)) {

            const product = new Product(req.body);
            await product.save();
            res.json({ message: "Product created successfully" });

        } else {
            res.status(403).json({ message: "You need to login as admin to create a product" });
            return
        }

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function getAllProducts(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();
            res.json(products);
        } else {
            const products = await Product.find({ isAvailable: true })
            res.json(products)
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function deleteProduct(req, res) {

    try {
        const productId = req.params.productId

        if (isAdmin(req)) {

            const product = await Product.findOne({ productID: productId })
            if (product == null) {
                res.status(404).json({ message: "Product not found" })
                return
            }

            await Product.findOneAndDelete({ productID: productId })

            res.json({ message: "Product deleted successfully" })
        } else {
            res.status(403).json({ message: "You need to login as admin to delete a product" })
            return
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export async function updateProduct(req, res) {

    try {

        const productId = req.params.productId
        if (isAdmin(req)) {
            const product = await Product.findOne({ productID: productId })

            if (product == null) {
                res.status(404).json({ message: "Product not found" })
                return
            }
            await Product.findOneAndUpdate({ productID: productId }, req.body)
            res.json({ message: "Product updated successfully" })
        } else {
            res.status(403).json({ message: "You need to login as admin to update a product" })
            return
        }

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export async function getProductById(req, res) {
    try {
        const productId = req.params.productId

        const product = await Product.findOne({ productID: productId })
        if (product == null) {
            res.status(404).json({ message: "Product not found" })
            return
        }
        if (product.isAvailable) {
            res.json(product)
        } else {
            if (isAdmin(req)) {
                res.json(product)
            } else {
                res.status(403).json({ message: "Product is not available" })
                return
            }
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}