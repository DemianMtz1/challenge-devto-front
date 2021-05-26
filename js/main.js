/* NAVIGATION  */
$(document).ready(function () {
  $(".cont-wrapp").load('./views/home.html');
  $('#filter-regex input[type="text"]').val('');
  loadView("./views/home.html", "home");
})

$('#post-btn-nav').click(ev => {
  let view = ev.target.dataset.view;
  let url = "./views/newPost.html"
  $(".cont-wrapp").load('./views/newPost.html');
  $('#filter-regex input[type="text"]').val('');
  loadView(url, view)
})

$('.dropdown-menu a.new-view').click(event => {
  event.preventDefault()
  let view = event.target.dataset.view
  if (view) {
    let url = `./views/${view}.html`
    //$(".cont-wrapp").load(url, view)
    $('#filter-regex input[type="text"]').val('');
    loadView(url, view)
  } else {
    alert('La opcion se encuentra deshabilitada...');
  }
})

$('#nav-home').click(ev => {
  let view = ev.target.dataset.view;
  let url = `./views/${view}.html`
  //$(".cont-wrapp").load('./views/newPost.html')
  $('#filter-regex input[type="text"]').val('');
  loadView(url, view)
})


$(".dropdown-menu #change-user-nav").click(() => {
  $("#myModal").modal("toggle");
});

const loadView = (url, view) => {
  $(".cont-wrapp").load(url, () => {
    switch (view) {
      case "home":
        printAllPost(getPosts(), "feed");
        break;

      case "newPost":
        //
        break;

      case "viewPost":
        //alert("cargando users")

        break;

      case "filteredView":

        break;

      case "viewUser":
        printViewUserInfo(getUsers(), "feed");
        break;

      default:
        //alert("cargando home")
        break;
    }
  });
};

/* GENERAL METHODS */
const getNumReactions = (idPost) => {
  let allReactions = getReactions();
  let numReactions = 0;
  if (allReactions != null) {
    let reactions = allReactions.data.reactions.filter(reaction => reaction.idPost == idPost);
    numReactions = reactions.length
  }
  return numReactions;
}
const getRepliesByPost = (idPost) => {
  let numReplies = 0;
  let replies = getReplies();
  if (replies != null) {
    let totalReplies = replies.data.replies.filter(item => item.idPost == idPost)
    numReplies = totalReplies.length;
  }
  return numReplies
}
const setUser = () => {
  let inputGroup = $('#form-users input[type="text"]');
  let config = { day: "numeric", year: "numeric", month: "long" };
  let today = new Date();
  let joined = today.toLocaleDateString("en-US", config);

  let newUser = {
    joined,
  };
  $.each(inputGroup, (idx, currentInput) => {
    newUser = {
      ...newUser,
      [currentInput.name]: currentInput.value,
    };
  });
  postUsers(newUser);

  $.each(inputGroup, (idx, currentInput) => {
    currentInput.value = "";
  });
};

const printUserInfo = (users) => {
  let groupSelect = $("#users-selector");
  groupSelect.children().remove()
  let groupText = $("#users-item-wrapper");
  let options,
    idx = 0,
    text;
  users.data.users.forEach((user, idx) => {
    if (idx == 0) {
      option = `
                <option value=${user._id} selected>${user.nickname}</option>
                `;
      text = `
                <p class="p-0 m-0 font-weight-bold ">${user.fullName}</p>
                <p class="p-0 m-0"><small>@${user.nickname}</small></p>
            `;
      $("#user-dropdown-pic").attr("src", user.avatarUrl);

      $("#user-dropdown-pic").attr("src", user.avatarUrl);
    } else {
      option = `
                <option value=${user._id}>${user.nickname}</option>
                `;
    }
    groupSelect.append(option);
  })
  groupText.append(text);
};

printUserInfo(getUsers());

const filteredUserById = (users, idUser) => {
  let filteredUser;
  users.data.users.forEach(user => {
    if (user._id == idUser) {
      filteredUser = user;
    }
  })
  return filteredUser;
};

$("#users-selector").change((ev) => {
  let selectedOwnerData = filteredUserById(getUsers(), ev.target.value);
  $("#user-dropdown-pic").attr("src", selectedOwnerData.avatarUrl);
  $("#users-item-wrapper").children().remove();
  let newText = `
            <p class="p-0 m-0 font-weight-bold ">${selectedOwnerData.fullName}</p>
            <p class="p-0 m-0"><small>@${selectedOwnerData.nickname}</small></p>
        `;
  $("#users-item-wrapper").append(newText);
  $("#replies-pic").attr("src", selectedOwnerData.avatarUrl);
});

const setPost = () => {
  let idUser = $('#users-selector option:selected').val();
  let idPost = Date.now();
  let config = { day: 'numeric', year: 'numeric', month: 'long' };
  let today = new Date();
  let createdDate = today.toLocaleDateString("en-US", config);
  let createdTime = `${today.getHours()}:${today.getMinutes() <= 9 ? '0' + today.getMinutes() : today.getMinutes()}`;

  let newPost = {
    idPost,
    idUser,
    createdDate,
    createdTime
  }

  let inputGroup = $('#form-new-post input[type="text"]')
  $.each(inputGroup, (idx, currentIn) => {
    newPost = {
      ...newPost,
      [currentIn.name]: currentIn.value
    }
  });

  let tagsArr = newPost.tags.replace(/,/gi, '').split(' ');
  tagsArr.splice(tagsArr.length - 1, 1);

  newPost.tags = tagsArr;
  savePost(newPost);

  $.each(inputGroup, (idx, currentIn) => {
    currentIn.value = ""
  });

}

const filteredCardsByTitle = regex => {
  let patternFilter = new RegExp(regex, "gi");
  let newTitles = getPosts();
  let filteredPosts = [], keyFiltered;

  newTitles.data.posts.forEach(post => {
    if (post.postTitle.match(patternFilter)) {
      newTitles[post._id] = {
        ...newTitles[post._id],
        key: post._id
      }
      filteredPosts.push(post)
    }
  })
  /*
  for (key in newTitles) {
    if (newTitles[key].postTitle.match(patternFilter)) {
      newTitles[key] = {
        ...newTitles[key],
        key
      }
      filteredPosts.push(newTitles[key])
    }
  }
*/
  return filteredPosts;
}


const printFilteredPost = post => {
  let cardsWrapper = $('#cards-wrapper');

  post.forEach(post => {
    console.log(post)
    let tagsAnc = post.tags.reduce((accum, tag) => {
      return accum + `<a class="my-1" href = "#" > <span>#</span>${tag}</a>`;
    }, "");
    let user = filteredUserById(getUsers(), post.idUser);

    let cardHtml = `<article class="card mb-3 nav-view-post" data-postkey=${post._id} >
        <div class="card-body">
          <div class="autor">
            <img class="rounded-circle border border-secondary ico-profile" src="${user.avatarUrl}" />
            <div class="autor-name">
              <div>${user.fullName}</div>
              <div>${moment(concatDate(post.createdDate, post.createdTime)).format("MMM Do YY")}</div>
            </div>
          </div>
          <div>
            <h2 class="card-title feature">
              <a href="#">${post.postTitle}</a>
            </h2>
          </div>
          <div class="tags tags-color d-flex flex-wrap">${tagsAnc}
    </div>
          <div class="reacts">
            <div class="react-left">
              <a href="#">
                <img src="images/single/reaction-heart.svg" />
                <span>${getNumReactions(post.idPost)} </span><span class="react-text"> &nbsp;reactions</span>
              </a>
              <a href="#">
                <img src="images/single/comentario.svg" class="/>
                <span>   </span><span class="react-text"> &nbsp; ${getRepliesByPost(post.idPost)}comments</span>
              </a>
            </div>
            <div class="react-right">
              <span>4 min read</span>
              <button>Save</button>

            </div>
          </div>
        </div>
      </article>`;

    cardsWrapper.append(cardHtml);

  })
}


const getFilteredReplies = replies => {
  let idPost = $('#post-article').data('idpost');
  let arrReplies = []
  replies.data.replies.forEach(reply => {
    if (reply.idPost == idPost) {
      arrReplies.push(reply)
    }
  })

  return arrReplies;
}

const getFilteredPostById = (post, id) => {
  let filteredPosts = [];
  post.data.posts.forEach(post => {
    if (post.idUser == id) {
      filteredPosts.push(post)
    }
  })

  return filteredPosts;
}

const printViewPost = post => {
  let accumTags = "";
  let postOwner = filteredUserById(getUsers(), post.data.post.idUser);
  let selectedUser = $("#users-selector").val();
  let currentUserInfo = filteredUserById(getUsers(), selectedUser);


  let allReactions = getReactions();

  if (allReactions != null) {
    let reactions = allReactions.data.reactions.filter(item => item.idPost == post.data.post.idPost);
    $("#reaction-number-heart").text(reactions.length)
  } else {
    $("#reaction-number-heart").text("0")
  }
  post.data.post.tags.forEach(tag => {
    accumTags += `<a href="#" class="mr-1"><span>#</span>${tag}</a>`
  })
  let articleContent =
    `
<article class="card mb-3 mt-3" id="post-article" data-idpost=${post.data.post._id}>
    <img src=${post.data.post.imgPost} class="card-img-top" alt="img">
    <div class="card-body p-5">
        <div>
            <h1 class="card-title feature">
                <a href="">${post.data.post.postTitle}</a>
            </h1>
        </div>

        <div class="tags" d-inline-flex>
            ${accumTags}
        </div>
        
        <div class="autor">
            <img class="rounded-circle border border-secondary ico-profile" src=${postOwner.avatarUrl} />
            <div class="autor-name">
                <div>${postOwner.fullName}</div>

                <div>
                    <time datetime="2021-03-01T14:40:00Z" class="date-no-year" title="${post.data.post.createdDate} - ${post.data.post.createdTime}">${post.data.post.createdDate}</time>
                    <em>
                        Originally published at
                        <a href="#" style="color:#1395b8">${postOwner.nickname}</a>
                    </em>
                    <span class="mr-4">・7 min read</span>
                </div>
            </div>

        </div>

        <div class="article-content">
            <p class="mt-2">${post.data.post.contentPost}</p>
        </div>
   </div>
 </article>
`;


  let discussionContent =
    `
   <article id="discussions" class="card p-4 mb-3 w-100">
        <div class="d-flex flex-column ">
        <div class="d-flex flex-row justify-content-between mb-4">
          <h2 class="font-weight-bold m-0 my-auto discussion-header"></h2>
          <button class="btn btn-outline-secondary rounded">Suscribe</button>
        </div>
        <div class="w-100 d-flex flex-row mb-2">
            <img src=${currentUserInfo.avatarUrl} alt="profile-pic" class="rounded-circle mr-2 profile-pic" id="replies-pic">
            <input type="text" placeholder="Add to the discussion" class="reply-input w-100 rounded"></input>
        </div>
        <div class="d-flex mb-4">
            <button type="button" class="btn bg-blue-boton text-white" id="reply-comment">Comentar</button> 
        </div>

    
        <div id="wrapper-replies" class="mt-2">

        </div>

        <div class="code-conduct d-flex justify-content-center">
          <a href="#" ">Code of conduct</a>
          <span role="presentation">•</span>
          <a href="#" ">Report abuse</a>
        </div>

      </div>
      </article>
   `;

  let articleReadNext =

    `
  <article id="read-next" class="card mb-3 w-100">
        <div class="card-body">
          <h2 class="card-title pl-4">Read next</h2>
          <div class="list-next pl-4">
            <a href="#">

              <div class="next-article d-flex align-items-center">

                <img class="ico-profile rounded-circle border border-secondary" loading="lazy"
                  alt="kauresss profile image" src="images/single/user6.webp" />

                <div class="d-flex flex-column justify-content-center ">
                  <h4>Getting paid less to do the same work on Upwork</h4>
                  <p class="text-muted">
                    Kauress - <time datetime="2021-03-06T00:21:07Z">Mar 6</time>
                  </p>
                </div>
              </div>

            </a>
            <a href="#">
              <div class="next-article d-flex align-items-center">
                <span>
                  <img class="ico-profile rounded-circle border border-secondary" loading="lazy"
                    alt="bekbrace profile image" src="images/single/user7.webp" />
                </span>
                <div class="d-flex flex-column justify-content-center">
                  <h4>Stripe for online payments</h4>
                  <p class="text-muted">
                    Bek Brace - <time datetime="2021-03-05T17:46:15Z">Mar 5</time>
                  </p>
                </div>
              </div>
            </a>
            <a href="#">
              <div class="next-article d-flex align-items-center">

                <img class="ico-profile rounded-circle border border-secondary" loading="lazy"
                  alt="jackssonandrey profile image" src="images/single/user8.webp" />

                <div class="d-flex flex-column justify-content-center">
                  <h4>Usando Docker e docker-composer no dia a dia</h4>
                  <p class="text-muted">
                    Andrey Araújo - <time datetime="2021-03-05T22:40:24Z">Mar 5</time>
                  </p>
                </div>
              </div>
            </a>
            <a href="#">
              <div class="next-article d-flex align-items-center ">

                <img class="ico-profile rounded-circle border border-secondary" loading="lazy"
                  alt="ilizette profile image" class="crayons-avatar__image" src="images/single/user9.webp" />

                <div class="d-flex flex-column justify-content-center">
                  <h4>Understanding useReducer in react</h4>
                  <p class="text-muted">
                    Elizabeth - <time datetime="2021-03-05T19:14:27Z">Mar 5</time>
                  </p>
                </div>
              </div>
            </a>

          </div>
        </div>
  </article>
  `


  $('#post-article-wrapper').append(articleContent);
  $('#post-article-wrapper').append(discussionContent);
  $('#post-article-wrapper').append(articleReadNext);



  let userCardInfo =
    `
  <div class="card bg-white1">
      <h5 class="card-header profile p-3"></h5>
      <div class="card-body">
        <div>
          <img class="rounded-circle ico-profile2" src=${postOwner.avatarUrl}>
          <span class="text-center font-weight-bold text-profile">${postOwner.fullName}</span>

        </div>

        <p class="card-text">${postOwner.description}</p>
        <a href="#" class="btn btn-blue btn-lg btn-block">Follow</a>
        <div class="pt-2">
          <span class=" card-title-sec">WORK</span><br />
          ${postOwner.work}
        </div>
        <div class="pt-2">
          <span class=" card-title-sec">LOCATION</span><br />
          ${postOwner.location}
        </div>
        <div class="pt-2">
          <span class=" card-title-sec">JOINED</span><br />
          ${postOwner.joined}
        </div>

      </div>
    </div>
  `


  let listingsPosts = getFilteredPostById(getPosts(), postOwner.idUser);
  let liListing = "";
  listingsPosts.forEach(post => {
    liListing +=
      `
    <li class="list-group-item">${post.postTitle}
      <h6 class="tags">${post.tags.reduce((accumTag, tag) => accumTag + `#${tag} `)}</h6>
    </li>
    `
  })
  let listings =
    `
      <div class="card card-side-right bg-white mt-3">
      <div class="card-header bg-white1 font-weight-bold text-profile-from">
        More from <span class="font-blue">${postOwner.fullName}</span>
      </div>
      <ul class="list-group list-group-flush">
          ${liListing}
      </ul>
    </div>
  `
  $('#owner-card-info').prepend(userCardInfo)
  $('#owner-card-info').append(listings)

}

const addReplies = allReplies => {
  $('#wrapper-replies').children().remove();
  let accumReplies = "";
  let currentUserReply;
  let replies = getFilteredReplies(allReplies)

  replies.forEach(reply => {
    currentUserReply = filteredUserById(getUsers(), reply.idUser)
    accumReplies +=
      `
    <div class="reply-card flex-column" data-idreply=${reply.idReply}>
      <div class="w-100 d-flex flex-row mb-3">

        <div class="w-100 d-flex flex-row">
            <img src=${currentUserReply.avatarUrl} alt="profile-pic" class="rounded-circle mr-2 profile-pic">

            <div class="w-100 p-2 border rounded">
                <p class=" text-muted">${reply.nickname} • ${reply.createdDate}</p>
                <p>${reply.contentReply}</p>
            </div>
        </div>

      </div>
  </div>
    `
  })

  $('.discussion-header').html(`Discussion ${replies.length}`)
  $('#wrapper-replies').append(accumReplies);

}

const setReply = () => {
  let idUser = $('#users-selector option:selected').val();
  let idReply = Date.now();
  let config = { day: 'numeric', year: 'numeric', month: 'long' };
  let today = new Date();
  let createdDate = today.toLocaleDateString("en-US", config);
  let createdTime = `${today.getHours()}:${today.getMinutes() <= 9 ? '0' + today.getMinutes() : today.getMinutes()}`;
  let idPost = $('#post-article').data('idpost');
  let contentReply = $('.reply-input').val()
  let newReply = {
    idUser,
    idReply,
    idPost,
    createdDate,
    createdTime,
    contentReply
  }
  let userFiltered = filteredUserById(getUsers(), idUser)
  newReply = {
    ...newReply,
    nickname: userFiltered.nickname
  }
  saveReply(newReply)
  contentReply = $('.reply-input').val('')
}

$('#filter-regex input[type="text"]').keypress(ev => {
  let keycode = (ev.keyCode ? ev.keyCode : ev.which);
  let regexFilter;
  if (keycode == '13') {
    ev.preventDefault()
    regexFilter = ev.target.value;
    $('.cont-wrapp').children().remove();
    $('.cont-wrapp').load('./views/filteredView.html', () => {
      let filteredCards = filteredCardsByTitle(regexFilter)
      printFilteredPost(filteredCards)
    })
  }
})

/* EVENT HANDLERS */
$(".cont-wrapp").on("click", "#set-user", () => {
  setUser()
})
$(".cont-wrapp").on('click', '#save-new-post', () => {
  setPost()
})

$(".cont-wrapp").on('click', '.nav-view-post', ev => {
  let key = ev.currentTarget.dataset.postkey;
  console.log(key)
  let viewPostContent = getPostByKey(key);
  $(".cont-wrapp").load('./views/viewPost.html', () => {
    $('#post-article-wrapper').children().remove();
    $('#owner-card-info').children().remove();
    printViewPost(viewPostContent)
    $('#wrapper-replies').children().remove();
    addReplies(getReplies())
  });
})

$(".cont-wrapp").on('click', '#reply-comment', ev => {
  setReply()
  $('#wrapper-replies').children().remove();
  addReplies(getReplies())
})

const printViewUserInfo = users => {
  $('#view-user-details').children().remove();
  $('#user-interaction-details').children().remove();
  let idUser = $('#users-selector').val();
  let filteredUser = filteredUserById(getUsers(), idUser);

  let userCard =
    `
    <img
        src=${filteredUser.avatarUrl}
        alt="avatar-imb"
        class="rounded-circle mb-2"
        style="width: 70px; height: 70px"
      />
      <h3 class="card-title font-weight-bold mb-2">${filteredUser.fullName}</h3>
      <p class="card-text mb-2">${filteredUser.description}</p>
      <p class="card-subtitle mb-2 text-muted mb-2">${filteredUser.joined}</p>
    </div>
  `;
  let allPosts = getPosts();
  let allReplies = getReplies();
  console.log(allPosts)
  let accumReplies = 0, accumPosts = 0;
  allPosts.data.posts.forEach(post => {
    if (post.idUser == idUser) {
      accumPosts++;
    }
  })

  allReplies.data.replies.forEach(reply => {
    if (reply.idUser == idUser) {
      accumReplies++;
    }
  })

  let publishedCard =
    `
    <li class="list-group-item"># ${accumPosts} post publicados</li>
    <li class="list-group-item"># ${accumReplies} comentarios escritos</li>
  `;
  $('#view-user-details').append(userCard);
  $('#user-interaction-details').append(publishedCard);
}

/* DATE-UTILITIES */

const printAllPost = (postCollection, type) => {
  let format = "MMMM Do";
  let showDate = "day";

  if (type != "") {
    type == "year" || type == "infinity" ? format = "MMM Do YY" : "MMM Do";
    type == "feed" || type == "week" ? showDate = "day" : showDate = "hour";
  }

  var cardWrapper = $("#card-wrapper");

  cardWrapper.empty();
  if(!postCollection.data){
    postCollection.forEach((item) => {
      let {
        _id,
        postTitle,
        tags,
        imgPost,
        contentPost,
        createdDate,
        createdTime,
        idUser,
      } = item;
      let post = item;
  
      var datePost = concatDate(createdDate, createdTime);
  
      let printFormatDate = moment(datePost).format(format);
      let printDateTime = type == "year" || type == "infinity" ? "" : `(${moment(datePost).startOf(showDate).fromNow()})`
      let numReactions = getNumReactions(item._id);
  
  
  
      var tagsAnc = tags.reduce((accum, tag) => {
        return accum + `<a href = "#" > <span>#</span>${tag}</a>`;
      }, "");
  
  
      var user = filteredUserById(getUsers(), idUser);
  
      var cardHtml = `<article class="card mb-3 nav-view-post" id="post${post._id}" data-postkey="${post._id}">
          <img src="${imgPost}" class="card-img-top" alt="...">
          <div class="card-body">
            <div class="autor">
              <img class="rounded-circle border border-secondary ico-profile" src="${user.avatarUrl
        }" />
              <div class="autor-name">
                <div>${user.fullName}</div>
                <div>${printFormatDate} ${printDateTime}</div>
              </div>
            </div>
            <div>
              <h2 class="card-title feature">
                <a href="#">${postTitle}</a>
              </h2>
            </div>
            <div class="tags">${tagsAnc}
      </div>
            <div class="reacts">
              <div class="react-left">
                <a href="#">
                  <img src="images/single/reaction-heart.svg" />
                  <span> ${numReactions} </span><span class="react-text"> &nbsp;reactions</span>
                </a>
                <a href="#">
                  <img src="images/single/comentario.svg" />
                  <span> ${getRepliesByPost(_id)}  </span><span class="react-text"> &nbsp;comments</span>
                </a>
              </div>
              <div class="react-right">
                <span>4 min read</span>
                <button>Save</button>
  
              </div>
            </div>
          </div>
        </article>`;
  
      cardWrapper.append(cardHtml);
      $("article:not(:first-of-type) .card-img-top").remove();
  
      /*$(".cont-wrapp").on("click", `#post${post}`, (event) => {
        //console.log($(event.target).data("postkey"));
        //console.log($(`#post${post}`).attr("data-postkey")); //.event.target.data("postkey");
        loadView(`./views/viewPost.html?postkey=${post}`, "viewPost");
      });*/
    });
    return;
  }

  postCollection.data.posts.forEach((item) => {
    let {
      _id,
      postTitle,
      tags,
      imgPost,
      contentPost,
      createdDate,
      createdTime,
      idUser,
    } = item;
    let post = item;

    var datePost = concatDate(createdDate, createdTime);

    let printFormatDate = moment(datePost).format(format);
    let printDateTime = type == "year" || type == "infinity" ? "" : `(${moment(datePost).startOf(showDate).fromNow()})`
    let numReactions = getNumReactions(item._id);



    var tagsAnc = tags.reduce((accum, tag) => {
      return accum + `<a href = "#" > <span>#</span>${tag}</a>`;
    }, "");


    var user = filteredUserById(getUsers(), idUser);

    var cardHtml = `<article class="card mb-3 nav-view-post" id="post${post._id}" data-postkey="${post._id}">
        <img src="${imgPost}" class="card-img-top" alt="...">
        <div class="card-body">
          <div class="autor">
            <img class="rounded-circle border border-secondary ico-profile" src="${user.avatarUrl
      }" />
            <div class="autor-name">
              <div>${user.fullName}</div>
              <div>${printFormatDate} ${printDateTime}</div>
            </div>
          </div>
          <div>
            <h2 class="card-title feature">
              <a href="#">${postTitle}</a>
            </h2>
          </div>
          <div class="tags">${tagsAnc}
    </div>
          <div class="reacts">
            <div class="react-left">
              <a href="#">
                <img src="images/single/reaction-heart.svg" />
                <span> ${numReactions} </span><span class="react-text"> &nbsp;reactions</span>
              </a>
              <a href="#">
                <img src="images/single/comentario.svg" />
                <span> ${getRepliesByPost(_id)}  </span><span class="react-text"> &nbsp;comments</span>
              </a>
            </div>
            <div class="react-right">
              <span>4 min read</span>
              <button>Save</button>

            </div>
          </div>
        </div>
      </article>`;

    cardWrapper.append(cardHtml);
    $("article:not(:first-of-type) .card-img-top").remove();

    /*$(".cont-wrapp").on("click", `#post${post}`, (event) => {
      //console.log($(event.target).data("postkey"));
      //console.log($(`#post${post}`).attr("data-postkey")); //.event.target.data("postkey");
      loadView(`./views/viewPost.html?postkey=${post}`, "viewPost");
    });*/
  });
};


/*FUNCTIONS FOR FILTERS */
const concatDate = (date, time) => {
  let fecha = time.split(" ")[0];

  fecha.length == 4 ? (fecha = "0" + fecha + ":00") : (fecha = fecha + ":00");

  let fechaCompleta = date + " " + fecha;

  let convertirFecha = new Date(fechaCompleta);

  return convertirFecha;
};

const currentWeek = (date) => {
  todaydate = date;

  var oneJan = new Date(todaydate.getFullYear(), 0, 1);

  var numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

  var result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);

  return result;
};

const arrayByCurrentYear = (array) => {
  
  let onlycurrentYear = array.filter((item) => {
    let currentYear =
      concatDate(item.createdDate, item.createdTime).getFullYear() ===
      new Date().getFullYear();
    return currentYear;
    
  });
  return onlycurrentYear;
};
const arrayByCurrentMonth = (array) => {
  
  let onlycurrentMonth = arrayByCurrentYear(array).filter((item) => {
    let currentMonth =
      concatDate(item.createdDate, item.createdTime).getMonth() ===
      new Date().getMonth();
    return currentMonth;
  });
  return onlycurrentMonth;
};

/*START FILTER POSTS */
const filterByFeed = (array) => {
  
  
    let filterByDay = arrayByCurrentMonth(array.data.posts).filter((item) => {
    let listFechaArreglo = concatDate(item.createdDate, item.createdTime);
    //console.log(listFechaArreglo, item[0], listFechaArreglo.getTime());

    let arrayCurrentDay = listFechaArreglo.getDate() === new Date().getDate();
    //console.log(arrayCurrentDay);
    return arrayCurrentDay;
  });
  //console.log(filterByDay);
  filterByDay.sort(function (a, b) {
    return (
      concatDate(b.createdDate, b.createdTime).getTime() -
      concatDate(a.createdDate, a.createdTime).getTime()
    );
  });
  
  printAllPost(getPosts(), "feed");
};

const filterByYear = (array) => {
  let currentDate = new Date()
  let onlyLastYear = array.data.posts.filter((item) => {
    let lastYear = []
      new Date(item.createdDate).getFullYear() ==
      currentDate.getFullYear() - 1;
    return lastYear;
  });

  let lastYear = onlyLastYear.sort(function (a, b) {
    return (
      concatDate(a.createdDate, a.createdTime).getTime() -
      concatDate(b.createdDate, b.createdTime).getTime()
    );
  });
  
  printAllPost(lastYear, "year");
};

const filterByMonth = (array) => {
  let onlycurrentMonth = arrayByCurrentMonth(array.data.posts);
  //meter después filtrado por replies
  let lastMonth = onlycurrentMonth.sort(function (a, b) {
    return (
      concatDate(a.createdDate, b.createdTime).getTime() -
      concatDate(b.createdDate, a.createdTime).getTime()
    );
  });
  //console.log(onlycurrentMonth);
  printAllPost(onlycurrentMonth, "month");
};

const filterByWeek = (array) => {
  let numWeek = currentWeek(new Date());
  let onlyCurrentWeek = arrayByCurrentMonth(array.data.posts).filter((item) => {
    let currentMonth =
      currentWeek(concatDate(item.createdDate, item.createdTime)) ===
      numWeek;
    return currentMonth;
  });

  //filtrar por replies
  onlyCurrentWeek.sort(function (a, b) {
    return (
      concatDate(b.createdDate, b.createdTime) -
      concatDate(a.createdDate, a.createdTime)
    );
  });
  //console.log(onlyCurrentWeek);
  printAllPost(onlyCurrentWeek, "week");
};

const filterByInfinity = array => {
  let miarreglo = array.data.posts;
  let filterByDay = miarreglo.forEach((item) => {
    let listFechaArreglo = concatDate(item.createdDate, item.createdTime);
    //console.log(listFechaArreglo, item[0], listFechaArreglo.getTime());
  });

  miarreglo.sort(function (a, b) {
    return (
      concatDate(b.createdDate, b.createdTime).getTime() -
      concatDate(a.createdDate, a.createdTime).getTime()
    );
  });

  //console.log("Filtradoslatest", miarreglo);
  printAllPost(miarreglo, "infinity");

};

const filterByLatest = (array) => {
  let miarreglo = array.data.posts;
  let filterByDay = miarreglo.forEach((item) => {
    let listFechaArreglo = concatDate(item.createdDate, item.createdTime);
    //console.log(listFechaArreglo, item[0], listFechaArreglo.getTime());
  });

  miarreglo.sort(function (a, b) {
    return (
      concatDate(b.createdDate, b.createdTime).getTime() -
      concatDate(a.createdDate, a.createdTime).getTime()
    );
  });

  //console.log("Filtradoslatest", miarreglo);
  printAllPost(miarreglo, "latest");
};
/*END FILTER POSTS */

const filterPosts = (filter) => {
  //checar como devolver los post con la key
  var getAllPosts = getPosts();

  let completeFechas = getAllPosts.data.posts.reduce(
    (accum, current, index) => {
      let {
        _id,
        postTitle,
        tags,
        imgPost,
        contentPost,
        createdDate,
        createdTime,
        idUser,
      } = current;

      //let newArray = {...postData[current], fechasConv: new Date(createdDate).getTime()}
      let newArray = {
        ...getAllPosts[current],
        fechasConv: new Date(createdDate).getTime(),
        yearPost: new Date(createdDate).getFullYear(),
      };

      return { ...accum, [current]: newArray };
    },
    {}
  );
  /*
  let latestPosts = Object.values(completeFechas).sort(function (a, b) {
    return b.fechasConv - a.fechasConv;
  });*/
};

//filter-desktop

$(".cont-wrapp").on("click", ".filter-desktop a", (event) => {
  $(".filter-desktop a").each((index, element) => {
    element.classList.remove("active");
  });
  let elementName = $(event.target).data("filter");
  //console.log(elementName);
  $(`#filtd-${elementName}`).addClass("active");
  switch (elementName) {
    case "feed":
      filterByFeed(getPosts());
      //console.log("Por feed");
      break;
    case "week":
      //console.log("Por week");
      //filterPosts(elementName);
      filterByWeek(getPosts());
      break;
    case "month":
      //console.log("Por month");
      filterByMonth(getPosts());
      break;
    case "year":
      filterByYear(getPosts());
      //console.log("Por year");
      break;
    case "infinity":
      filterByFeed(getPosts());
      printAllPost(getPosts(), "infinity");
      break;
    case "latest":
      filterByLatest(getPosts());
      //console.log("Por latest");
      break;
    case "default":
      //console.log("Por si acaso");
      break;
  }
});



$(".cont-wrapp").on("change", "#feed-filter-select", (event) => {
  let filterSelected = $("#feed-filter-select").val();
  switch (filterSelected) {
    case "feed":
      filterByFeed(getPosts());
      break;
    case "week":
      //filterByWeek(getPosts());
      filterByFeed(getPosts());
      break;
    case "month":
      //filterByMonth(getPosts());
      filterByFeed(getPosts());
      break;
    case "year":
      //filterByYear(getPosts());
      filterByFeed(getPosts());
      break;
    case "infinity":
      //printAllPost(getPosts(), "infinity");
      filterByFeed(getPosts());
      break;
    case "latest":
      //filterByLatest(getPosts());
      filterByFeed(getPosts());
      break;
    case "default":
      break;
  }

})

/*Guardar reactions */

$(".cont-wrapp").on("click", "#reaction-heart", (event) => {
  let idUser = $('#users-selector option:selected').val();
  let currentIdPost = $('#post-article').data('idpost');
  let idReply = Date.now();
  let createdTime = Date.now();
  let idPost = currentIdPost;

  let newReaction = {
    idUser,
    idReply,
    idPost,
    createdTime
  }

  saveReaction(newReaction)

  let allReactions = getReactions();

  if (allReactions != null) {
    let reactions = allReactions.data.reactions.filter(item => item.idPost == currentIdPost);
    $("#reaction-number-heart").text(reactions.length)
  }
});