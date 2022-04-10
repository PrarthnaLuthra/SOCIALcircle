// const e = require("connect-flash");

// const { notify } = require("../../routes");

{
  //to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          new PostComments(data.data.post._id);
          new ToggleLike($('.toggle-like-button', newPost));

          new notify({
            theme:'relax',
            text: 'Post Published',
            type:'success',
            layout:'topRight',
            timeOut:1500
          }).show()
        },
        
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //creating a post in dom
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
      <p>
        ${post.content} 
    
        <small> ${post.user.name}  </small>
        
    
        <small>
          <a class="delete-post-button"href="/posts/destroy/<%= post.id%>"
            ><i class="fa-solid fa-delete-left"></i
          ></a>
        </small>
        <br>
        <small>
                            
         <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
             0  <i style="color: red" class="fa-solid fa-heart"></i>
         </a>
                            
        </small>
    
       
      </p>
    
      <div class="PostComments">
       
        <form action="/comments/create" method="POST">
          <input
            type="text"
            name="content"
            id="Type here to add comment....."
            required
          />
        <input type="hidden" name="post" value="${post._id}" />
          <input type="submit" value="Add Comment" />
        </form>
        
    
        <div class="post-comments-list">
          <ul id="post-comments -${post._id}">
            
          </ul>
        </div>
      </div>
    </li>
    `);
  };

  //metho to delete post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post._id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };
  createPost();
}
