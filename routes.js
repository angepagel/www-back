const controllers = require('./controllers');
const express = require('express');
const multer = require('multer');


const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });
  

router.get('/posts', controllers.getAllPosts);
router.get('/posts/:id', controllers.getPost);
router.get('/latestpost', controllers.getLatestPost);
router.post('/posts', controllers.createPost);
router.post('/posts/:id', controllers.updatePost);
router.delete('/posts/:id', controllers.deletePost);
router.post('/login', controllers.login);
router.post('/upload', upload.array('files'), controllers.upload);
router.get('/uploads', controllers.getUploads);
router.post('/deleteUpload', controllers.deleteUpload);


module.exports = router;
