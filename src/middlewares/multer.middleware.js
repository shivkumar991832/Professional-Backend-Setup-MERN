import multer from "multer";

// configuration of multer

// storage is middelware or methods
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    //   must check this clg(file)
    }
  })
  
  export const upload = multer({
     storage: storage 
    // or.. storage  : key = value
    })