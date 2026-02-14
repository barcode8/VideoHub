//This is a wrapper function that accepts the whole controller and the controller runs inside this function which if succeeds properly, ends normally else it catches whatever error happened

const asyncHandler = (func)=> async (req,res,next)=>{
    try {
        return await func(req, res, next)
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success : false,
            message: error.message
        })
    }
}

export {asyncHandler}