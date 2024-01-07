


exports.newOrder = async(req , res) => {
    try{
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong"
        })
    }
}