const {User} = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {where} = require("sequelize");
const nodeMailer = require('nodemailer');
const {jwtDecode} = require('jwt-decode')
const { Op } = require('sequelize');

function generateToken(id, name, email, role) {
  return jwt.sign({id, name, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

const sendMailConfirmEmailFunc = async (email, lang, token) => {
  const confirmationUrl = `${process.env.API_HOST}user/confirm?lang=${lang}&token=${token}`;

  const html = `
      <h1>hello</h1>
      Press <a href="${confirmationUrl}">link</a> to confirm your email adress.
    `;

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_SEVICES_USER,
      pass: process.env.MAIL_SEVICES_PASS
    }
  })

  await transporter.sendMail(
    {
      from: 'FDA',
      to: email,
      subject: 'Email Confirmation',
      html,
    }
  )
}

class UserController {
  async registration(req, res) {
    try {
      if (!req.body) return res.status(401).json({message: "Empty form"});

      const {name, email, role, password} = req.body;

      const candidate = await User.findOne(
          {where: {email}}
      )

      if (candidate) {
        return res.status(400).json({message: "email is already used"})
      }

      const hashPassword = await bcrypt.hash(password, 3);

      const user = await User.create({name, email, role, password: hashPassword});

      const token = generateToken(user.id, name, email, user.role);

      return res.json({token})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async login(req, res) {
    try {
      if (!req.body) return res.status(401).json({message: "Empty form"});

      const {email, password} = req.body;

      const user = await User.findOne(
        {where: {email}}
      )

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(404).json({message: "User not found or access denied"})
      }

      const token = generateToken(user.id, user.name, user.email, user.role, user.isVerified)

      return res.json({token})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getProfile(req, res) {
    try {
      const {id} = req.params;

      const userProfile = await User.findOne(
        {where: {id}}
      )

      return res.json(userProfile)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async profileUpdate(req, res) {
    try {
      const {id} = req.params;

      if (!req.body) return res.status(401).json({message: "Empty form"})

      const {name, email, password, address} = req.body;

      await User.update({
        name, email, password, address
      }, {where: {id}})

      return res.json({message: "Updated profile", profile: {name, email, address}})
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async avatarUpdate(req, res) {
    try {
      if (!req.files) return res.status(401).json({message: "File not found"})

      const {id} = req.params;

      let filename;

      const profile = await User.findOne(
        {where: {id}}
      )

      const {avatar} = req.files;
      filename = uuid.v4() + ".jpg";
      await avatar.mv(path.resolve(__dirname, '..', 'static', filename));

      if (profile.avatar) {
        await fs.unlink(`${path.resolve(__dirname, '..', 'static', profile.avatar)}`, (err) => console.log(err))
      }

      await User.update({
        avatar: filename
      }, {where: {id}})

      return res.json({ message: 'Avatar updated successfully', avatar: filename })
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async delete(req, res) {
    try {
      if (!req.params) return res.status(401).json({message: "Error"});

      const { id } = req.params;

      await User.destroy(
        {where: {id}}
      )

      return res.json({message: "Deleted profile"})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }



  async sendMailTo(req, res) {
    try {
      const {lang, token} = req.body
      const decoded = jwtDecode(token);
      sendMailConfirmEmailFunc(decoded.email, lang, token).catch(console.error);

      return res.json({message: "Message was send"})
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async confirmMail(req, res) {
    try {
      const {lang, token} = req.query;
      const decoded = jwtDecode(token);

      await User.update({
        isVerified: true
      }, {where: {email: decoded.email}})

      return res.redirect(`${process.env.FRONT_HOST}/${lang}/`)
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async regenerateToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({message: 'Authorization token not provided'});
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      const newToken = generateToken(user.id, user.name, user.email, user.role, user.isVerified);

      return res.json({token: newToken});
    } catch (e) {
      return res.status(500).json(e.message)
    }
  }

  async check(req, res) {
    try {
      // if (req.method === "OPTIONS") return res.status(401).json({message: 'invalid method'});

      const {email} = req.body;

      console.log(email)

      const user = await User.findOne(
        {where: {email}}
      )

      sendMailFunc(decoded.email, lang, token).catch(console.error);

      return res.json({message: "Message was send"})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async resetPassword(req, res) {
    try {
      const {email} = req.body;

      const user = await User.findOne(
        {where: {email}}
      )

      return res.json(userProfile)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

//add delete products from restaurants on delete restaurants
//users permission per restaurants
//Register a New User
//User Login
//Get User Profile
//Update User Profile
//Upload User Avatar
//Delete User Account

//Change User Password
//Admin: List All Users



module.exports = new UserController()