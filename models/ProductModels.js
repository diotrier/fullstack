import { Sequelize } from "sequelize";
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Products = db.define('product', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING

}, {
    freezeTableName: true
})

export default Products;

(async () => {
    try {
        await db.sync();
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Unable to synchronize the database:", error);
    }
})();