/* HTTP METHODS USERS  */
const getUsers = () => {
  let usersCollection;
  $.ajax({
    method: "GET",
    url: "http://localhost:8080/users",
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
    url: "http://localhost:8080/users",
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
    url: `http://localhost:8080/users/${id}`,
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
    url: `http://localhost:8080/users/${id}.json`,
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
    url: "http://localhost:8080/posts",
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
    url: `http://localhost:8080/posts/${id}`,
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
    url: "http://localhost:8080/posts",
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
    url: `http://localhost:8080/posts/${id}`,
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
    url: `http://localhost:8080/posts/${id}`,
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
    url: "http://localhost:8080/replies",
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
    url: "http://localhost:8080/replies",
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
    url: `http://localhost:8080/replies/${id}`,
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
    url: `http://localhost:8080/replies/${id}`,
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
    url: `http://localhost:8080/reactions`,
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
    url: "http://localhost:8080/reactions",
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
    url: `http://localhost:8080/reactions/${id}`,
    success: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
}