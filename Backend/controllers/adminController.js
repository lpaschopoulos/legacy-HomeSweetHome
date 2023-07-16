const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const adminSignUp = async (req, res) =>{
  try {
    const checkAdmin = await Admin.findOne({email: req.body.email})
    if (checkAdmin) {
      res.send({msg: "email already in use"})
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, async function(err, hash) {
        const admin = { email: req.body.email, password: hash}
        const createdAdmin = await Admin.create(admin);
          const token = jwt.sign({id: createdAdmin._id}, "legacy")
          res.send({token})       
      });
  });
  } catch (error) {
    console.log("Error:", error);
  }
}


const adminLogin = async (req, res) =>{
  try {
    const admin = await Admin.findOne({email: req.body.email})
    if (admin) {
      bcrypt.compare(req.body.password, admin.password, function(err, result) {
        if (result) {
          let token = jwt.sign({id:admin._id }, "legacy")
          res.send(token)
        } else {
          return res.send({msg:'Invalid Password'})
        }
      })
    } else {
      return res.send({msg:"Admin not found!"});
    }
  } catch (error) {
    console.log('login Error:', error);
  }
}

const verifyAdmin = async (req, res) =>{
  if (!req.body.token) {
    res.send({msg:false});
    return
  }
  try {
    let payload = jwt.verify(req.body.token, "legacy")
    if (payload) {
      let admin = await Admin.findOne({_id: payload.id})
      if (admin) {
        let token = jwt.sign({id: admin._id}, "legacy")
        res.send(user)

      } else {
        res.send({message: 'Invalid token'});
      }
    } else {
      res.send({ msg: "Token expired or invalid"});
    }
  } catch (error) {
    res.send({'Invalid Token': error})
  }
}

module.exports = {
  adminSignUp,
  adminLogin,
  verifyAdmin
}