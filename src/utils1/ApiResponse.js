class ApiResponse {
    // define constructor for storage
    constructor(statusCode, data, message = "success"){
        // overwrite
        this.statusCode = statusCode
        this.data = data 
        this.message = message
        this.success = statusCode < 400
    }
}