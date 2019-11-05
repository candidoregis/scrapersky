// Function to do the scrapping
function scrape() {
  event.preventDefault();
  $.ajax({
    url: "/api/scrape",
    method: "GET"
  }).then(function (data) {
    location.href = "/";
  });
}

// Function to save the chosen article and remove from the initial list
function saveArticle() {
  event.preventDefault();
  $card = $(this).parents(".col");
  $.ajax({
    method: "POST",
    url: "/api/articles/",
    data: {
      id: $(this).attr("data-id"),
    }
  }).then(function () {
    $card.remove();
  });
}

// Function to delete the chosen article
function deleteArticle() {
  event.preventDefault();
  $card = $(this).parents(".col");
  $.ajax({
    method: "DELETE",
    url: "/api/articles/",
    data: {
      id: $(this).attr("data-id"),
    }
  }).then(function () {
    $card.remove();
    location.href = "/saved";
  });
}

// Function to delete ALL articles (saved or not)
function clearAll() {
  event.preventDefault();
  $.ajax({
    method: "DELETE",
    url: "/api/articles/all"
  }).then(function () {
    location.href = "/";
  });
}

// Function to add a comment to an article
function addComment() {
  let $input;

  if (event.type === "click") { //in case the user clicks on add button
    console.log("cliquei");
    $input = $(this).siblings("input");
  } else {
    if (event.key.toUpperCase() === "ENTER") { //in case the user press the enter key
      console.log("apertei");
      $input = $(this);
    } else {
      return;
    }
  }
  // console.log($input.val());

  let comment = $input.val().trim();

  if (comment !== "") {
    let id = $input.data("id");
    let data = {
      comment: comment
    };
    $.ajax({
      method: "POST",
      url: `api/comment/${id}`,
      data: data
    }).then(function (article) {
      renderNewComment(article.comments[article.comments], id, data.comment);
      $input.val("");
    });
  }

}

// Function to render the newly added comment
// Not working properly, modal is not refreshing after adding, need to refresh the whole page
function renderNewComment(commentId, modalId, comment) {
  let $newA = $("<a>");
  let $newP = $("<p>");
  let $comments = $(`#modal-${modalId} .modal-content`);

  // 'a' tag
  $newA.attr("class", "btn btn-small");
  $newA.append(`<i class="material-icons btn-del-comment">clear</i>`);
  $newA.data("id", commentId);
  $newA.click(deleteComment);
  $newA.data("article-id", modalId);

  // 'p' tag
  $newP.attr("style", "margin-bottom: 5px;");
  $newP.append($newA);
  $newP.append(" " + comment);

  // comments' tag
  $comments.append($newP);
  $comments.focus();
}

// Function to open comments modal
// Not working properly
function openComments() {
  let id = $(this).data("id");
  let $input = $(`#modal-${id} .comment`);
  $input.data("id", id);
  $input.val("");
}

// Function to render the newly added comment
// Not working
function deleteComment() {
  event.preventDefault();

  //To be done

}

$(document).ready(function () {
  $(".btn-save-article").on("click", saveArticle);
  $(".btn-del-article").on("click", deleteArticle);
  $(".scrape").on("click", scrape);
  $(".clear-all").on("click", clearAll);
  $(".modal-trigger").on("click", openComments);
  $(".comment").on("keypress", addComment);
  $(".btn-add-comment").on("click", addComment);
  $(".btn-del-comment").on("click", deleteComment);
  $('.modal').modal();
});