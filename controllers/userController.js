const db = require("../models");
const bcrypt = require("bcrypt");

// create main model

const User = db.users;
const Area = db.areas;

// main work

// 1. create and save new user

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, username, password, email, area_id, role } =
      req.body;

    const emailCheck = await User.findOne({ where: { email: email } });

    if (emailCheck) {
      return res
        .status(409)
        .json({ message: "User with given Email already exist" });
    }

    // Check if the provided area_id exists in the areas table
    if(role === "user"){
      const area = await Area.findByPk(area_id);
      if (!area) {
        return res
          .status(404)
          .json({ message: "Area not found with the provided area_id" });
      }
      const salt = await bcrypt.genSalt(Number(10));
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: hashedPassword,
        email: email,
        area_id: area_id,
      });
      return  res.status(200).send(user);
    }
    
    if(role === "admin"){
      const salt = await bcrypt.genSalt(Number(10));
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: hashedPassword,
        email: email,
        role: role
      });
      return res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. login user
exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid User Name or password" });
    };

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid User Name or password" });
    };

    if(user.role === "user"){
      return res.status(200).json({
        status: true,
        user
      });
    }
    if(user.role === "admin") {
      return res.status(200).json({
      status: true,
      user
    });
    }
  } catch (error) {
    res.status(403).json({ status: false, error: error });
  }
};

// 3. find all users

exports.findAllUsers = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const maxPageSize = 10;

    // Fetch the total number of users in the database
    const totalCount = await User.count();

    // Calculate the dynamic pageSize based on total users
    const pageSize = Math.min(maxPageSize, totalCount);

    // Calculate the offset based on the requested page and dynamic pageSize
    const offset = (page - 1) * pageSize;

    // Fetch the paginated users
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      where: { role: "user" },
      limit: pageSize,
      offset,
      include: [
        {
          model: Area,
          attributes: ["area_name"], // Include only the 'area_name' attribute of the Area model
          required: false, // Use left join to include users without an associated area
        },
      ],
    });

    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      users,
      meta: {
        totalUsers: count,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. find user by id

exports.findUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne(
      { where: { user_id: id } },
      { attributes: { exclude: ["password"] } }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. update user by id

exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.update(req.body, { where: { user_id: id } });
    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. delete user by id

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await User.destroy({ where: { user_id: id } });
    res.status(200).send({ message: "User deleted successfully", User });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. change password for a user
exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password provided is valid
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Generate a new hash for the new password
    const newSalt = await bcrypt.genSalt(Number(10));
    const newHashedPassword = await bcrypt.hash(newPassword, newSalt);

    // Update the user's password in the database
    await User.update(
      { password: newHashedPassword },
      { where: { user_id: userId } }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
