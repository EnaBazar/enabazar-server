class ErrorHandler extends Error {

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

    }
}
export const errorMiddleware = (err,req,res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internet server error";
       if(err.name === "CastError"){
        const message = `Invaild ${err.path}`;
        err = new ErrorHandler(message,400);

       }
       if (err.name === "TokenExpiredError"){
        const message = `Json Web Token is invaild, Try again`;
        err = new ErrorHandler(message,  400);

       }
       if (err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
       }
       return res.status(err.statusCode).json({
        succes:false,
        message:err.message,
       })
}
export default ErrorHandler