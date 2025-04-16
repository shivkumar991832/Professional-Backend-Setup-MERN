// asyncHandler is a HOF which return function
// this is a wrapper function which will be use everywhere(important for your journey)
// const asyncHandler = (fn) => async (req , res, next)=>{
//     try {
//         await fn(req , res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// } 


// export {asyncHandler}
