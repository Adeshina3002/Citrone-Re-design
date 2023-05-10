const multer = require("multer")
const path = require("path")
// const storage = multer.diskStorage({})

// const fileFilter = (req, file, cb) => {
//     let ext = path.extname(file.originalname)

//     // All acceptable extensions
//     const acceptableExtensions = [
//         ".jpg",
//         ".jpeg",
//         ".png",
//         ".docx",
//         ".pdf",
//         ".js",
//         ".html",
//         ".css",
//         ".py",
//         ".pptx",
//         ".txt",
//         ".zip"
//     ];

//     // check if the user input file extension is acceptable
//     if(!acceptableExtensions.includes(ext)) {
//         cb(new Error({ message: "File format not supported!..."}))
//         return
//     }
//     cb(null, true)
// }

// const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5, // 5 MB
//       files: 1
//     },
//     fileFilter: (req, file, cb) => {
//       if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
//         return cb(new Error('Only image or pdf files are allowed'));
//       }
//       cb(null, true);
//     }
//   });

// module.exports = multer({
//     storage: storage,
//     fileFilter: fileFilter
// })

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
    }),
    fileFilter: function (req, file, cb) {
      const allowedFileTypes = [
        ".jpg",
        ".jpeg",
        ".png",
        ".docx",
        ".pdf",
        ".js",
        ".html",
        ".css",
        ".py",
        ".pptx",
        ".txt",
        ".zip"
      ];
      const filetypes = new RegExp(allowedFileTypes.join("|"), "i");
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Only the following file types are allowed: " + allowedFileTypes.join(", "));
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
  }).single('submissionFile');


module.exports = upload;