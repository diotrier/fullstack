import Products from "../models/ProductModels.js";
import path from 'path';
import fs from 'fs'

export const getProducts = async (req, res) => {
    try {
        const response = await Products.findAll()
        res.json(response)

    } catch (error) {
        console.log(error.massage)
    }
}

export const getProductsById = async (req, res) => {
    try {
        const response = await Products.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json(response)

    } catch (error) {
        console.log(error.massage)
    }
}

export const saveProducts = (req, res) => {
    if (req.files == null) return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Products.create({ name: name, image: fileName, url: url });
            res.status(201).json({ msg: "Product Created Successfuly" });
        } catch (error) {
            console.log(error.message);
        }
    })

}
export const updateProducts = async (req, res) => {
    const products = await Products.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!products) res.status(404).json({ msg: "No Data Found" });
    let fileName = ''
    if (req.files == null) {
        fileName = products.image
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${products.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Products.update({ name: name, image: fileName, url: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProducts = async (req, res) => {
    const products = await Products.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!products) return res.status(400).json({ msg: "No data found" });

    try {
        const filepath = `./public/images/${products.image}`;
        fs.unlinkSync(filepath);
        await products.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }

}