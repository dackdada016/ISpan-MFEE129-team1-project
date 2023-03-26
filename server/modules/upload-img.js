const multer = require('multer');
const {v4 :uuidv4} = require('uuid');

const extMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp':'.webp'
};
//file-> req.file ; cb-> callback function
const fileFilter = (req, file, cb)=>{
  cb(null, !!extMap[file.mimetype]); //沒有錯誤->給空值(null)  //!!->轉成boolean; undefined->false, 有值->true 
};
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null , __dirname+'/../public/uploads')
  },
  filename:(req,file,cb)=>{
    const filename = uuidv4() +extMap[file.mimetype];
    //uuidv4() -> 檔名(隨機)
    //extMap[file.mimetype]-> 副檔名
    cb(null, filename);
  }
}) 
//匯出
module.exports = multer({fileFilter, storage});