const { populate } = require("../models/post");
const Post = require("../models/post");


module.exports.home = function (req, res) {
  //Populating the post for each object
  Post.find({})
    .populate("user")
    .populate({
      path:'comments',
      populate:{
        path:'user'
      }
    })
    .exec(function (err, posts) {
      return res.render("home", {
        title: "SOCIALcircle| Home",
        posts: posts,
      });
    });
};
