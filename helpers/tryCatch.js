
exports.tryCatch = (controller) =>async(req,res,next)=>P {
  try {
    await controller(req,res)
  } catch (error) {
    next(err)
  }
}
