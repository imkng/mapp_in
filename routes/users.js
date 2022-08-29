const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { validate } = require("../models/User");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//login

router.post("/login",async(req,res)=>{
    console.log(req.body)
    try {
        //find user
        const user = await User.findOne({username: req.body.username});
         
        !user && res.status(400).json("Wrong username or password!") 
        
        //validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        !validPassword && res.status(400).json("Wrong username or password!")

        res.status(200).json({
            _id: user.id, 
            username: user.username
        })

    } catch (error) {
        res.status(500).json(error);
        
    }
})

module.exports = router;