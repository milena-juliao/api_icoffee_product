require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')

const app = new express()
app.use(express.json())

const port = process.env.PORT || 3002

//Model
const Product = mongoose.model('Product', {
    nome: String,
    descricao: String,
    imagem: String,
    preco: Number,
    quantidade_estoque: Number,
    desconto: Boolean
})

//List products
app.get("/", async (req, res) => {
    return res.json("hello world");
})

app.get("/teste", async (req, res) => {
    return res.json("está tudo certo.");
})//remover após terminar os testes.

app.get("/products", async (req, res) => {
    try{
        const products = await Product.find()
        return res.send(products)
    }catch(error){
        console.error('Error list products:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

//Save new product
app.post("/save_product", async (req, res) => {
    try {
        const { nome } = req.body
        const findProduct = await Product.findOne({ nome })

        if (findProduct) {
            return res.status(400).json({ error: "This product already exists!" })
        }

        const product = new Product({
            nome: req.body.nome,
            descricao: req.body.descricao,
            imagem: req.body.imagem,
            preco: req.body.preco,
            quantidade_estoque: req.body.quantidade_estoque,
            desconto: req.body.desconto
        })

        await product.save()
        res.status(201).json({ message: "Product saved successfully!" })
    } catch (error) {
        console.error('Error saving product:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

//Update product
app.put("/update_product_:id", async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
        nome: req.body.nome,
        descricao: req.body.descricao,
        imagem: req.body.imagem,
        preco: req.body.preco,
        quantidade_estoque: req.body.quantidade_estoque,
        desconto: req.body.desconto
    }, {
        new: true
    })

    return res.send(product)
})

//Delete product
app.delete("/:id", async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    return res.send(product)
})

app.listen(port, () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to MongoDB");
            console.log("Api running on port " + port);
        })
        .catch(error => console.error('Error connecting to MongoDB:', error));
})