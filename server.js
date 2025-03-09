const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 6743;

const userFile = path.join(__dirname, "users.json");

app.use(express.urlencoded({ extended:true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const loadUsers = ()=>{
    try{
        const data = fs.readFileSync(userFile, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

const saveUsers = (users)=>{
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

app.get("/addUsers", (req, res)=>{
    // res.sendFile(path.join(__dirname, "index.html"));
    const users = loadUsers();
    res.render("index", {users});
})

app.post("/addUsers", (req, res)=>{
    let { name, email, password } = req.body;
    let users = loadUsers();

    if(users.find(user => user.email === email)){
        return res.status(400).send({message: "Email already exists"});
    }

    let newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    // res.send({message: "User added successfully"});
    res.redirect("/addUsers");
})

app.get("/allUsers", (req, res)=>{
    res.send(loadUsers());
})

app.post("/updateUser", (req, res)=>{
    let { name, email, password } = req.body;
    let users = loadUsers();
    let user = users.find(user => user.email === email);
    if (user){
        if(name) user.name = name;
        if(password) user.password = password;
        saveUsers(users);
        // res.send({message: "User updated successfully"});
        res.redirect("/addUsers");
    } else {
        res.status(404).send({message: "User not found"});
    }
})

app.post("/deleteUser", (req, res)=>{
    let { email } = req.body;
    let users = loadUsers();
    let filteredUsers = users.filter(user => user.email !== email);

    if(filteredUsers.length < users.length){
        saveUsers(filteredUsers);
        // res.send({message: "User deleted successfully"});
        res.redirect("/addUsers");
    } else {
        res.status(404).send({message: "User not found"});
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})