import { User } from "../models/user.js";


export const newUser = async (req,res) => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body;

    if (!name || !email || !photo || !gender || !_id || !dob) {
      return next(new ErrorHandler("All Fields Are Required", 400));
    }

    let savedUser = await User.findById(_id);
    if (savedUser) {
      return res.status(200).json({
        success: true,
        message: `Welcome , ${savedUser.name}`,
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
    next(error);
  }
};
