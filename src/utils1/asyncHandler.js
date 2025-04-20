//this is a wrapper
//asyncHandler is HOF which takes function as a argument
// asyncHandler is for create a method and then export it

// wraper function(on the basis of promises)
const asyncHandler = (requestHandler) =>{
     return(req, res, next)=>{
        Promise.resolve(requestHandler(req, res ,next)).
        catch((error)=>next(error))
    }
}



export {asyncHandler}


