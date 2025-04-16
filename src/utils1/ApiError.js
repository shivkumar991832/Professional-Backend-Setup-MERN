// Error Handeling using Error Class(Nodejs)
// Hendeling Api Error
class ApiError extends Error {
    constructor(
        // who ever use contructor must give below
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        // overwrite with super call
        super(message)
        this.statusCode = statusCode
        this.data = null //usually
        this.message = message
        this.success = false
        this.errors = errors

    //   usefull for big line of code
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
        
    }
}

export {ApiError}