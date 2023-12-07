const db = require("../models");
const bcrypt = require("bcrypt");

// create main model

const User = db.users;
const Area = db.areas;

// main work

// 1. create and save new user

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, username, password, email, area_id } =
      req.body;

    const emailCheck = await User.findOne({ where: { email: email } });

    if (emailCheck) {
      return res
        .status(409)
        .json({ message: "User with given Email already exist" });
    }

    // Check if the provided area_id exists in the areas table
    const area = await Area.findByPk(area_id);
    console.log(area)
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
    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. login user
exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userCheck = await User.findOne({
      where: { username: username },
      include: [
        {
          model: Area,
          attributes: ["area_id"], // Specify the attributes you want to retrieve
          as: "area", // Alias for the association
        },
      ],
    });

    if (!userCheck) {
      return res.status(401).json({ message: "Invalid User Name or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, userCheck.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid User Name or password" });
    }

    // Check login conditions based on user role
    switch (userCheck.role) {
      case "root":
        // If the user has the role of 'root', allow login without area_id
        break;
      case "admin":
        // If the user has the role of 'admin', require a valid area_id
        if (!userCheck.area || !userCheck.area.area_id) {
          return res
            .status(401)
            .json({ message: "Admin user requires a valid area" });
        }
        break;
      case "user":
        // If the user has the role of 'user', require a valid area_id
        if (!userCheck.area || !userCheck.area.area_id) {
          return res
            .status(401)
            .json({ message: "User requires a valid area" });
        }
        break;
      default:
        // Handle other roles if needed
        break;
    }

    res.status(200).json({
      status: true,
      username: userCheck.username,
      email: userCheck.email,
      role: userCheck.role,
      area: userCheck.area, // Include the associated area in the response
    });
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
