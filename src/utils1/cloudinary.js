import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

   // Configuration of cloudinary thats give permission of file upload
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath)=>{
         try {
            //checking local path ?
            if (!localFilePath) return null
            // upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
               resource_type: "auto"
            })
            // now file has been uploaded successfully
            console.log("file is uploaded on cloudinary success !!!", response.url)
            return response;
         } catch (error) {
            fs.unlinkSync(localFilePath)///remove the locally(server) saved temporary file as the upload opeartion got failed
            return null
         }
    }
      
    export {uploadOnCloudinary}


    