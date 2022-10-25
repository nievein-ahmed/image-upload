const path = require("path")

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors")
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const uploadProductImageLocal = async (req, res) => {
    if(!req.files){
      throw new CustomError.BadRequestError("no file uploaded , please upload a file to continue")  
    }
  const productImage = req.files.image;
  

  const maxSize = 1024 * 1024
  if(productImage.size > maxSize){
    throw new CustomError.BadRequestError("please upload image smaller than 1KB")
  }

  const imagePath = path.join(__dirname,"../public/upload/"+`${productImage.name}`)
  

  await productImage.mv(imagePath)
  return res.status(StatusCodes.OK).json({image:{src:`/upload/${productImage.name}`}})
  res.send("upload product image");
};

const uploadProductImage = async (req,res) => {
   
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true,
        folder:"image-upload"
    })
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}
module.exports = uploadProductImage;
