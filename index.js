const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
// override with POST having ?_method=DELETE

app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join( __dirname, "public")));
app.use(methodOverride('_method'));

const {v4 : uuidv4} = require('uuid');
 

let posts = [       //post is an array of objs
    {
        id : uuidv4(1),
        username: "Lakshay Panwar",
        content: "I love coding !",
    },
    {
        id : uuidv4(1),
        username: "Andrew Tate",
        content: "What color is your Buggati ?!",
    },
    {
        id : uuidv4(1),
        username: "David Goggins",
        content: "Stay hard son !",
    },
]


// L-4: API for viewing  all posts (GET) /posts
//using get request
app.get("/posts", (req,res)=>{
    res.render("index.ejs", {posts});
});

//L-5: API for  submitting a new post (POST) /posts 
// using get request to submit data in form
app.get("/posts/new", (req,res)=>{
    res.render("new.ejs");
});

//using post request to add the submitted data into our posts(array of objects)
app.post("/posts", (req,res)=>{
    let {username,content} = req.body;  //fetching data from form
    let id = uuidv4();
    posts.push({ id, username,content});//push new post object to existing posts array of objects
    res.redirect("/posts");             //IMP - ALL API Request to this route, will be redirected to same page
});

//L-7: Display one single post (GET) /posts/:id
// :id is dynamic part which will be replaced by actual id from url
app.get("/posts/:id", (req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id === p.id);
    res.render("show.ejs",{post});
});

//L-8: Update the content of an individual post
// patch request is specially used for edit ing, however you may use POST also
app.patch("/posts/:id", (req,res)=>{
    let  {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p)=> id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});

//L-9:  Lets create a option of editing the post, option will redirect to another dynamic webpage(edit.ejs)
//      from edit.ejs we will submit new content which will be displayed in main /posts
app.get("/posts/:id/edit", (req,res)=>{
    let  {id} = req.params;
    let post = posts.find((p)=> id === p.id);
    res.render("edit.ejs", {post});
});

//L-10: Deleting the POST
// Using filter method of post we will return all other post except the one to be deleted.
// and filter returns new array, Then assign filtered posts back to all posts
app.delete("/posts/:id", (req,res)=>{
    let {id} = req.params;
    posts = posts.filter((p)=> id !== p.id );
    res.redirect('/posts');
});

app.listen(port, ()=>{
    console.log("Listening to port : 8080");
});