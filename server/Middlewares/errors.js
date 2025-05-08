

const errorHandler = (err,req,res,next) => {
  const status = err.status || 500 
  const message = err.message  || 'something went wrong'
  return res.status(status).json({
    status,
    message ,
    success: false
  })
}

const error = (status,message) =>{
  const err = new Error()
  err.status = status
  err.message = message
  return err
}

module.exports = {errorHandler , error}