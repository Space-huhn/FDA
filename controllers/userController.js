const {User} = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {where} = require("sequelize");
const nodeMailer = require('nodemailer');
const {jwtDecode} = require('jwt-decode')

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
      const {name, email, role, password} = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({message: "empty form"})
      }

      const candidate = await User.findOne(
        {where: {email, name}}
      )

      //add existing emile validation

      if (candidate) {
        return res.status(400).json({message: "email is already used"})
      }

      const hashPassword = await bcrypt.hash(password, 3)

      const user = await User.create({name, email, role, password: hashPassword})

      const token = generateToken(user.id, name, email, user.role);

      return res.json({token})
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async login(req, res) {
    try {
      const {email, password} = req.body;
      const user = await User.findOne(
        {where: {email}}
      )

      if (!user) {
        return res.status(500).json("user not exist")
      }

      let comparePassword = bcrypt.compareSync(password, user.password)

      if (!comparePassword) {
        return res.status(500).json("wrong pass")
      }

      const token = generateToken(user.id, user.name, user.email, user.role, user.isVerified)

      return res.json({token})
    } catch (e) {
      res.status(500).json(e.message)
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

  async profile(req, res) {
    try {
      if (req.method === "OPTIONS") return res.status(401).json({message: 'invalid method'});

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
      const {id} = req.params

      let filename;
      let textFields = {};

      if (req.body) {
        const {name, email, password, address} = req.body
        textFields = {name, email, password, address}
      }

      const profile = await User.findOne(
        {where: {id}}
      )

      if (req.files && req.files.avatar) {
        const {avatar} = req.files;
        filename = uuid.v4() + ".jpg"
        await avatar.mv(path.resolve(__dirname, '..', 'static', filename))

        if (profile.avatar) {
          await fs.unlink(`${path.resolve(__dirname, '..', 'static', profile.avatar)}`, (err) => console.log(err))
        }
      }

      const updateData = {
        ...textFields,
        ...(filename && {avatar: filename})
      };

      await User.update({
        ...updateData
      }, {where: {id}})

      const updateProfile = await User.findOne(
        {where: {id}}
      )

      return res.json(updateProfile)
    } catch (e) {
      return res.status(500).json(e.message)
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

module.exports = new UserController()