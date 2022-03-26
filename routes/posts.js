const express = require('express')
const router=express.Router();
const postController= require('../controllers/posts_controller')
router.get('/igtv',postController.igtv)
module.exports=router;