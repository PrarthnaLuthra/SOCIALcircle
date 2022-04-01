const { populate } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  //Populating the post for each object
  try {
    let posts = await Post.find({})
    .sort('-createdAt')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    let users = await User.find({});

    return res.render("home", {
      title: "SOCIALcircle|Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error", err);
    return;
  }
};
