const Users = require("./../../models/users").userModel
const Utils = require("./../../utils/util")
const Auth = require("./../../middlewares/auth")

let registerUser = async(req, res) => {
    try {
    let { username, email, password, mobile } = req.body;
    let checkUserExists = await Users.findOne({
        $or: [
          { email: email },
          { mobile: mobile }
        ]
      });
      
    if(checkUserExists) {
      res.status(400).json({
        status: false,
        message: "User with this email or mobile aleady exists"
      })
    }
    else {
        req.body.password = await Utils.encryptPassword(password)
        await Users.create(req.body)
       res.status(201).json({ 
        status: true,
        message: 'User registered successfully'
     });
    }
}
catch(err) {
    return res.status(400).json({
        status: false,
        message: err
        });
}

}

let login = async(req, res) => {
   try { 
    let { email, password } = req.body;
    const user = await Users.findOne({email})
    console.log("user", user)
    if (!user || !Utils.decryptPassword(password, user.password)) {
        return res.status(400).json({
             status: false,
             message: 'Invalid email or password'
             });
      }
      let resData = user.toJSON();
      let token = Auth.generateToken(user);
      resData["access_token"] = token
       res.status(200).json({
        status: true,
        message: "User logged in successfully",
        data: resData
       })
       }
       catch(err) {
        return res.status(400).json({
            status: false,
            message: err
            });
    }
}

let getUserDetails = async(req, res) => {
    //console.log("req",req.user)
   try { 
    let findUser = await Users.findOne({_id: req.user.userId}).select('-password');
    if(!findUser) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
            });
    }
    else {
        return res.status(200).json({
            status: true,
            message: 'User details fetched',
            data: findUser
            });
    }
}
catch(err) {
    return res.status(400).json({
        status: false,
        message: err
        });
}
}

let updateUserDetails = async(req, res) => {
   try {
      const userId = req.params.id;
      let user = await Users.findOne({_id: userId});
      if (!user) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
            });
      }
  
      // Update user fields (only the fields that are provided)
      const updates = req.body;
  
      if (updates.password) {  
        updates.password = await Utils.encryptPassword(updates.password)
      }
      let checkMobileExists
      if(updates.mobile) {
         checkMobileExists = await Users.findOne({mobile: updates.mobile,_id: { $nin: [userId] }});
      }
      if (checkMobileExists) {
        return res.status(400).json({
            status: false,
            message: "mobile number exists"
            });
      }
  
      user = await Users.findOneAndUpdate({ _id:  userId}, { $set: updates }, {
        new: true, 
      }); //Users.findOneAndUpdate({ _id }, data)
  
      delete user.password;
  
      return res.status(200).json({
        status: true,
        message: 'User details updated',
        data: user
        });
    
   }
   catch(err) {
    return res.status(400).json({
        status: false,
        message: err
        });
   }
}

let getUsersList = async(req, res) => {
    try {
        let UserList = await Users.find({role: "user"})
        res.status(200).json({
            status: true,
            message: "Users list fetched",
            data: UserList
        })
    }
    catch(err) {
       console.log(error) 
        return res.status(400).json({
            status: false,
            message: err
            });
    }
}



module.exports = {
    registerUser,
    login,
    getUserDetails,
    updateUserDetails,
    getUsersList
}
  