/* HTTP METHODS USERS  */
const getUsers = () => {
  let usersCollection;
  $.ajax({
    method: "GET",
    url: "https://devto-backend-app.herokuapp.com/users",
    success: (response) => {
      usersCollection = response;
    },
    error: (error) => {
      console.log(error);
    },
    async: false,
  });
  return usersCollection;
};

const postUsers = (newOwner) => {
  $.ajax({
    method: "POST",
    url: "https://devto-backend-app.herokuapp.com/users",
    contentType : "application/json",
    data: JSON.stringify(newOwner),
    dataType : 'json',
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};
const deleteUsers = (id) => {
  $.ajax({
    method: "DELETE",
    url: `https://devto-backend-app.herokuapp.com/users/${id}`,
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const putUsers = (id, data) => {
  $.ajax({
    method: "PUT",
    url: `https://devto-backend-app.herokuapp.com/users/${id}.json`,
    data: JSON.stringify(data),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

/* HTTP METHODS POST*/
const getPosts = () => {
  let usersCollection;
  $.ajax({
    method: "GET",
    url: "https://devto-backend-app.herokuapp.com/posts",
    success: (response) => {
      usersCollection = response;
    },
    error: (error) => {
      console.log(error);
    },
    async: false,
  });
  return usersCollection;
};

const getPostByKey = id => {
  let usersCollection;
  $.ajax({
    method: "GET",
    url: `https://devto-backend-app.herokuapp.com/posts/${id}`,
    success: (response) => {
      usersCollection = response;
    },
    error: (error) => {
      console.log(error);
    },
    async: false,
  });
  return usersCollection;
};


const savePost = newOwner => {
  $.ajax({
    method: "POST",
    contentType : "application/json",
    url: "https://devto-backend-app.herokuapp.com/posts",
    dataType : 'json',
    data: JSON.stringify(newOwner),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const deletePost = id => {
  $.ajax({
    method: "DELETE",
    url: `https://devto-backend-app.herokuapp.com/posts/${id}`,
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const putPost = (id, data) => {
  $.ajax({
    method: "PUT",
    url: `https://devto-backend-app.herokuapp.com/posts/${id}`,
    data: JSON.stringify(data),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

/*METHODS HTTP REPLIES */

const getReplies = () => {
  let repliesCollection;
  $.ajax({
    method: "GET",
    url: "https://devto-backend-app.herokuapp.com/replies",
    success: (response) => {
      repliesCollection = response;
    },
    error: (error) => {
      console.log(error);
    },
    async: false,
  });
  return repliesCollection;
};

const saveReply = newReply => {
  $.ajax({
    method: "POST",
    contentType : "application/json",
    url: "https://devto-backend-app.herokuapp.com/replies",
    dataType : 'json',
    data: JSON.stringify(newReply),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const deleteReply = id => {
  $.ajax({
    method: "DELETE",
    url: `https://devto-backend-app.herokuapp.com/replies/${id}`,
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const putReply = (id, data) => {
  $.ajax({
    method: "PUT",
    url: `https://devto-backend-app.herokuapp.com/replies/${id}`,
    data: JSON.stringify(data),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const saveReaction = (newReaction)=>{
  $.ajax({
    async:false,
    contentType : "application/json",
    method: "POST",
    dataType : 'json',
    url: `https://devto-backend-app.herokuapp.com/reactions`,
    data: JSON.stringify(newReaction),
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
}

const getReactions = () =>{
  let reactions;
  $.ajax({
    async:false,
    method: "GET",
    url: "https://devto-backend-app.herokuapp.com/reactions",
    success: (response) => {
      reactions = response;
    },
    error: (error) => {
      console.log(error);
    },
    
  });
  return reactions;
}

const deleteReactions = (id) =>{
  $.ajax({
    method: "DELETE",
    url: `https://devto-backend-app.herokuapp.com/reactions/${id}`,
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
}