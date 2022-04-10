const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
  try {
    let post=await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if(req.xhr){
      return res.status(200).json({
        data:{
          post:post
        },
        message:'Post Created!'
      })
    }


    req.flash('success', 'Yaye! Your Post is UP')

    return res.redirect("back");
  } catch (err) {
    req.flash('error', err)
  }
};

module.exports.destroy = async function (req, res) {

    try{
        let post =await Post.findById(req.params.id) ;
    // .id means converting the object id into string
    if (post.user == req.user.id) {
      await Like.deleteMany({likable:post, onModel:
      Post});
      await Like.deleteMany({_id:{$in: post.comments}})
      
      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      if(req.xhr){
        return res.status(200).json({
          data:{
            post_id: req.params.id
          },
          message:"Post deleted"
        })
      }

      req.flash('success', 'Post deleted')
        return res.redirect("back");
     
    } else {
        req.flash('error', "You cannot delete this post")
      return res.redirect("back");
    }

    }catch(err){
        req.flash('error', err)
        return res.redirect("back");

    }
  
}
