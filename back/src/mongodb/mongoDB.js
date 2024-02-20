const mongoose = require("mongoose");
const userModel = require ('./models/user.model');
require("dotenv").config({ path: "../.env" });

mongoose.connect(process.env.URLMDB,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
    //mongoDB
    console.log("connexion MongoDB success.")
    userModel.findById({ _id: userId })
    .select("-password")
    .then((findUsers) => {
        //data here
        console.log(findUsers)
    })
    .catch((err) => res.status(400).json({ err: err }));
})
.catch((err) => console.log("Connexion à MongoDB échouée ! : " + err));

