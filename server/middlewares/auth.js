import User from "../models/user";

// middleware to check admin or not
export const isAdmin = async(req , res , next) => {
  try {
    const { id } = req.query;

    if(!id){
        return res.status(402).json({
            success:false,
            message:"user id not present"
        })
    }
418
    const user = await User.findById(id);

    if(!user){
        return res.status(402).json({
            success:false,
            message:"user not found"
        })
    }

    if(user.role.toLocaleLowerCase() !== "admin"){
        return res.status(402).json({
            success:false,
            message:"Only Admin is allowed"
        })
    }
    next()

  } catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        error:error.message,
        message:"something went wrong"
    })
  }
};
