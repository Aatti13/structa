export const handleServerError = (res, error, statusCode=500, message="Internal Server Error")=>{
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || "Unknown Error"
  });
}

export const handleCustomError = (res, statusCode, message)=>{
  return res.status(statusCode).json({
    success: false,
    message
  });
}