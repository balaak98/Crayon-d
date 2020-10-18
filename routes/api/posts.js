const express = require('express');
const router = express.Router();
const {  validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const checkValidId = require('../../middleware/checkId');
const Post = require('../../models/Post');
const User = require('../../models/User');
const multer = require('multer');
const fs = require('fs');




const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString().replace(':','-').replace(':','-') + file.originalname);
  }
});
const upload = multer({storage: storage});


//upload posts
router.post(
  '/',upload.single('imageData'),
  [auth
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!req.body.text && !req.file){
      return res.status(400).json({ errors: 'Cannot Post Data' });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text ? req.body.text:'',
        name: user.name,
        user: req.user.id,
        imageData: req.file ? req.file.path: '',
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

//get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


//delete specific post
router.delete('/:id', [auth, checkValidId('id')], async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      const path = post.imageData;
      await post.remove();
      if(path.length>0){
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return
          }
          console.log("removed locally");
        })
      }

      res.json({ msg: 'Post removed' });
    } catch (err) {  
      res.status(500).send('Server Error');
    }
  });

//Like a post
router.put('/like/:id', [auth, checkValidId('id')], async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (post.likes.some(like => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
  
      post.likes.unshift({ user: req.user.id });
  
      await post.save();
  
      return res.json(post.likes);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });
  
//UnLike a post
  router.put('/unlike/:id', [auth, checkValidId('id')], async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post.likes.some(like => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post has not yet been liked' });
      }

      post.likes = post.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
  
      await post.save();
  
      return res.json(post.likes);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  });

module.exports = router;