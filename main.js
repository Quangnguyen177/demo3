var express = require('express')
var app =  express()
app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

const Handlebars = require('handlebars')
var hbs=require('hbs')
const { ObjectId } =require('mongodb')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://quangdeptrai:quang2002@cluster0.la1w3zr.mongodb.net/test'
// var url = 'mongodb://localhost:27017'


hbs.registerHelper('check', (price)=> {
    return (price>20);
});
hbs.registerHelper('check1', (color)=> {
    return (color==="Purple");
});
app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/new',(req,res)=>{
    res.render('newProduct')
})
app.get('/delete', async (req,res)=>{
    let id = req.query.id
    let objectId = ObjectId(id)
    let client= await MongoClient.connect(url)
    let dbo=client.db("DB")
    await dbo.collection("shopeeProduct").deleteOne({_id:objectId})
    res.redirect('/view')

})
app.get('/view',async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo=client.db("DB")
    let prods = await dbo.collection("shopeeProduct").find().toArray()
    console.log(prods)
    res.render('viewProducts',{'prods':prods})
})
app.post('/insertProduct',async(req,res)=>{
    let name = req.body.txtName
    let price = Number(req.body.txtPrice) 
    let image = req.body.txtImage
    let color = req.body.color
    
    let product = {
        'name' : name,
        'price': price,
        'image' : image,
        'color' : color
    }

    let client = await MongoClient.connect(url);
    let dbo = client.db("DB")
    await dbo.collection("shopeeProduct").insertOne(product)
    res.redirect('/view')
})

app.post('/search',async(req,res)=>{
    let name = req.body.txtSearch
    let client = await MongoClient.connect(url)
    let dbo=client.db("DB")
    let prods = await dbo.collection("shopeeProduct").find({'name': new RegExp(name, 'i')}).toArray()
    console.log(prods)
    res.render('viewProducts',{'prods':prods})
})
const PORT =  process.env.PORT || 5000

app.listen(PORT)
console.log("Server is running")














//let prods = await dbo.collection("shopeeProduct").find({'name': new RegExp(name, 'i')}).limit(5).toArray()

// app.get('/asc',async(req,res)=>{
//     let client = await MongoClient.connect(url);
//     let dbo = client.db("DB")
//      asc= await dbo.collection("shopeeProduct").find().sort({price:1}).toArray()
//     res.render('/view',{'asc':asc})
// })