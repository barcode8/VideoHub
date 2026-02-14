class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode= statusCode
        this.data=null,
        this.message=message
        this.success=false
        this.errors=errors

        //This statement allows us to either use the original stacktrace returned by the JS engine or to create a fresh one that hides all irrelevant internal noise
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default ApiError