const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Ink & Introspection - Your Source of Insights and Inspiration! A digital haven for all enthusiasts of Journal Writing. Whether you're a seasoned expert or a newcomer eager to learn and grow, our blog is designed to provide you with insights to dialy life.Our mission is simple: to cultivate a community where knowledge and creativity converge. Through engaging articles, thought-provoking discussions, and expert insights, we aim to spark your curiosity, fuel your passion, and empower you to navigate the diverse landscapes of Life Activities.Stay updated with the latest trends, breakthroughs, and best practices in Dialy Life through our regular updates and informative posts.Join us on this exciting journey of discovery and enlightenment. Your adventure begins here at Ink & Introspection.Happy reading!";
const aboutContent = "Welcome to Ink & Introspection a space dedicated to the art of self-expression, introspection, and personal growth. We believe that every story matters and that the act of documenting our lives through words holds incredible power.";
const contactContent = "+123456789- Bill Richards, California, CA";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
await mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
}

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({})
  .then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch(err => {
    console.error('Error fetching posts:', err);
  });
});

app.get("/about", function (req, res) {
  res.render("about", { 
    aboutContent: aboutContent
   });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    console.error('Error saving post:', err);
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
    Post.findOne({ _id: requestedPostId })
      .then(post => {
        if (!post) {
          return res.status(404).send("Post not found");
        }
  
        res.render("post", {
          title: post.title,
          content: post.content
        });
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        // Respond with an error page or appropriate response
        res.status(500).send('Internal Server Error');
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
