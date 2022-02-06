const express = require("express");
const app = express();
app.use(express.static('./public')); //set root folder for static data
app.use(express.static('../backend')); //set root folder for static data


app.get("/", (req, res) => {
    res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/login", (req, res) => {
    res.sendFile("./public/login.html", { root: __dirname });
});

app.get('/admin',(req,res)=>{
    res.sendFile("./public/admin.html", { root: __dirname });
})

app.get('/signup',(req,res)=>{
    res.sendFile("./public/signup.html", { root: __dirname });
})

app.get('/search',(req,res)=>{
    res.sendFile("./public/search.html", { root: __dirname });
})

app.get('/product',(req,res)=>{
    res.sendFile("./public/product_details.html", { root: __dirname });
})

app.get('/cart',(req,res)=>{
    res.sendFile("./public/cart.html", { root: __dirname });
})

app.get("/users/:id", (req, res) => {
    res.sendFile("./public/user.html", { root: __dirname });
});

app.get("/contact", (req, res) => {
    res.sendFile("./public/contact.html", { root: __dirname });
});

app.get("/users/", (req, res) => {
    res.sendFile("./public/users.html", { root: __dirname });
});

app.get("/shop", (req, res) => {
    res.sendFile("./public/shop.html", { root: __dirname });
});

app.get("/checkout", (req, res) => {
    res.sendFile("./public/checkout.html", { root: __dirname });
});

app.get("/confirmation", (req, res) => {
    res.sendFile("./public/confirmation.html", { root: __dirname });
});

app.get("/reviews", (req, res) => {
    res.sendFile("./public/blog.html", { root: __dirname });
});

app.get("/review", (req, res) => {
    res.sendFile("./public/blog.html", { root: __dirname });
});

app.get("/interests", (req, res) => {
    res.sendFile("./public/interests.html", { root: __dirname });
});

app.get("/add_review", (req, res) => {
    res.sendFile("./public/add_review.html", { root: __dirname });
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Frontend Server Hosted at http://localhost:${PORT}`);
});
