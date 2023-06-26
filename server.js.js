let express = require("express")
let mongodb = require("mongodb")

let app = express()
let db = null

app.use(express.static('public'))

const Mongoclient = mongodb.Mongoclient;

let dbstring = "mongodb+srv://appUser:Khabeer@2003@cluster0.kpdhouk.mongodb.net/Myapp?retryWrites=true&w=majority"
let dbName = "Myapp"
mongodb.connect(dbstring,{useNewUrlParser:true,useUnifiedTopology:true},function(err,client){
  if(err){
    throw err;
  }
    db = client.db(dbName)
    
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/', function(req,res){
  db.collection('items').find().toArray(function(err,items){
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple to do app</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  
</head>
<body>
  <div class="container" >
    <h1 class="display-4 text-center py-1">All in One CRUD Operations</h1>

    <div class="jumbotron p-3  shadow-sm">
      <form action="/create-item" method="POST" >
        <div class="d-flex align-items-center">
          <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-info">Add New Item</button>
          </div>
      </form>
    </div>

    <ul class="list-group pb-5">
    ${items.map(function(item){
     return  `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id=${item._id} class="edit-me btn btn-dark btn-sm mr-1">Edit</button>
          <button data-id=${item._id} class="delete-me btn btn-danger btn-sm ">Delete</button>
        </div>
      </li>`
     }).join('') }
      
    </ul>
  
  </div>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  
</body>
</html>
    
    `)

  })
    
})
app.post(`/create-item`,function(req,res){
   db.collection('items').insertOne({text:req.body.item},function(){
    res.redirect("/")
   })
    
})


app.post(`/update-item`,function(req,res){
 // console.log(req.body.text)
 db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:req.body.text}},function(){
  res.send("updated")
 })
})

app.post(`/delete-item`,function(req,res){
  db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
    res.send("data deleted")
  })
})