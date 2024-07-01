const bcrypt = require("bcrypt");
const TaiKhoan = require("../models/account");
const { message } = require("antd");
const BenhNhan = require("../models/BenhNhan");
module.exports.hello = async (req, res) => {
  res.json("day laf duong link /user");
};

module.exports.dangkyTK = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const userData = new TaiKhoan(req.body);
    console.log(userData);
    console.log(email);
    const userExit = await TaiKhoan.findOne({ email });

    if (userExit) {
      return res.status(400).json({ message: "User already exits." });
    }

    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const saveUser = await userData.save();

    const newBenhNhan = new BenhNhan({
      Ten: username,
      Email: email,
      accountId: saveUser._id,
    });

    const saveBenhNhan = await newBenhNhan.save();
    res.status(200).json({
      message: "User registered successfully",
      taiKhoan: saveUser,
      benhNhan: saveBenhNhan,
    });
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};

module.exports.dangnhap = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await TaiKhoan.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "user does not exits" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid password." });
    }
    const idTK = user.id;
    const benhnhan = await BenhNhan.findOne({ accountId: idTK });
    res.status(200).json({ message: "login successfil", data: benhnhan });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports.home = async (req, res, next) => {};
