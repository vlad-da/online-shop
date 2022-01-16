const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');


//we will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

//Upload image 
router.post('/upload', (req, res) => {
  try {
      // console.log(req.files); check file 
      if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({msg: 'No files were upload.'});
      
      const file = req.files.file;
      if(file.size > 1024 * 1024) {// if file.size > 1mb
          removeTmp(file.tempFilePath);
          return res.status(400).json({msg: 'Size too large'});
      }
        
      if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
        removeTmp(file.tempFilePath);
        return res.status(400).json({msg: 'File format is incorrect.'});
      }
      cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result) => {
        if(err) throw err;
        //after upload will have file tpm
        removeTmp(file.tempFilePath);
        
        res.json({public_id: result.public_id, url: result.secure_url});
      });
      
  } catch (err) {
      res.status(500).json({msg: err.message});
  }
});

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err;
    });
};

module.exports = router;
