var multer = require('multer')
const uploadFolder = '/Users/dronfies/desarrollo/utm/dronfiesuss/uploads'

// File: {"fieldname":"file","originalname":"prueba.txt","encoding":"7bit","mimetype":"text/plain"}

const mimeTypes = [
    'image/jpeg',
    'image/bmp',
    'image/gif',
    'image/png',
    'image/tiff'
]

let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, uploadFolder)

    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // console.log(`Prueba: ${JSON.stringify(file)}`)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})



function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (mimeTypes.indexOf(file.mimetype) == -1) {
        cb(new Error('Invalid type of file'))
    }else{
        cb(null, true)
    }

    //     // To reject this file pass `false`, like so:
    //     cb(null, false)

    // // To accept the file pass `true`, like so:
    // cb(null, true)

    // // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))

}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

export let singleFile = (filename) => {
    return upload.single(filename);
} 

/**
 * 
 * @param filename [  { name: 'avatar', maxCount: 1 },  { name: 'gallery', maxCount: 8 }]
 */
export let multipleFiles = (fields) => {
    return upload.fields(fields);
}