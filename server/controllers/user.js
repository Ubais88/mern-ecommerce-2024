const User = require('../models/user')


exports.newUser = async (req,res) => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    if (!name || !email || !photo || !gender || !_id || !dob) {
      return res.status(401).json({
        success: false,
        message: `All fields are required`,
      });
    }
    let savedUser = await User.findById(_id);
    if (savedUser) {
      return res.status(400).json({
        success: false,
        data: savedUser,
        message: `Already have an account`,
      });
    }

    savedUser = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    res.status(200).send({
      success: true,
      Data: savedUser,
      message: `Welcome , ${savedUser.name}`,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        error: error.message,
        message: 'something went wrong'
    })
  }
};

exports.getAllUsers = async (req , res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      Data: users,
      message: "all users fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        error: error.message,
        message: 'something went wrong'
    })
  }
};
