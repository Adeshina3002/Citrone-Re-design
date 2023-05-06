const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname)

    // All acceptable extensions
    const acceptableExtensions = [
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

    // check if the user input file extension is acceptable
    if(!acceptableExtensions.includes(ext)) {
        cb(new Error({ message: "File format not supported!..."}))
        return
    }
    cb(null, true)
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})