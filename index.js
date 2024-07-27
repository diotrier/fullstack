import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import ProductRouter from './routes/ProductRoute.js'


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json())
app.use(fileUpload());
app.use(express.static("public"))
app.use(ProductRouter)

app.listen(PORT, () => console.log(`Server running on ${PORT}`))

