const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Aarya:elsa@cluster0.lxjd0.mongodb.net/WikiDB", {
  useNewUrlParser: true
})

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema)

app.get("/", function(req, res){
  res.sendFile(__dirname +'/index.html')
})

app.route("/articles")

.get(function(req, res){
  Article.find({}, function(err, foundArticles){
    if(!err)
    res.send(foundArticles)
    else
    res.send(err)
  })
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })
newArticle.save(function(err){
  if(!err)
  res.send("A-OK")
  else
  res.send(err)
})
})

.delete(function(req, res){
  Article.deleteMany(
    {},
    function(err){
      if(!err)
      res.send("A-OK")
      else
      res.send(err)
    }
  )
})

app.route("/articles/:articleTitle")

.get(function(req, res){

  const title = req.params.articleTitle

  Article.findOne(
    {title: title},
    function(err, foundArticle){
      if(foundArticle)
      res.send(foundArticle)
      else
      res.send("No matching article found")
    }
  )
})

.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err)
      res.send("Updated successfully")
      else
      res.send(err)
    }
  )
})

.patch(function(req, res){
  Article.updateOne(
    { title: req.params.articleTitle },
    req.body,
    function (err, response) {
      if (!err)
      res.send("Article has been updated.")
    }
  )
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err)
      res.send("Successfully deleted.")
      else
      res.send(err)
    }
  )
})









app.listen(3000, function(){
  console.log("Server started on port 3000");
})
