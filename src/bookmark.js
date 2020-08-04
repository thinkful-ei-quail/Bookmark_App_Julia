import $ from "jquery";
import store from "./store.js";
import api from "./api.js";

const generateInitialView = function (bookmarkString) {
  return `
    <div>
      <div class="container">
          <button class="new-bookmark js-new-bookmark">
              <span class="button-label">New Bookmark</span>
          </button>
        
          <form class="filter-by js-filter-by">
              <label for="min-rating" class="visually-hidden">Set Min Rating</label>
              <select id="min-rating" name="min-rating">
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
              </select>
              <input type="submit" class="button" value="Set Min Rating">
          </form>
      </div>
      <ul class="bookmark-list js-bookmark-list">
        ${bookmarkString}
      </ul>
    </div>`;
};

const generateAddBookmarkView = function () {
  return `
    <h2>Add New Bookmark</h2>
    <form class="container">
      <label for="bookmark-title" class="visually-hidden">Title</label>
      <input type="text" id="bookmark-title" name="bookmark-title" placeholder="title" required />
      <label for="bookmark-url" class="visually-hidden">Url</label>
      <input type="text" id="bookmark-url" name="bookmark-url" placeholder="url" required />
      <label for="bookmark-rating" class="visually-hidden">Rating</label>
      <select id="bookmark-rating" name="bookmark-rating">
        <option value="1">Rating: 1 Star</option>
        <option value="2">Rating: 2 Stars</option>
        <option value="3">Rating: 3 Stars</option>
        <option value="4">Rating: 4 Stars</option>
        <option value="5">Rating: 5 Stars</option>
      </select>
      <label for="bookmark-desc" class="visually-hidden">Description</label>
      <textarea id="bookmark-desc" name="bookmark-desc" placeholder="add description (optional)" style:"height:200px"></textarea>
      <input type="submit" class="create js-create"/>
    </form>
    <div class="container">
      <button class="cancel js-cancel">
          <span class="button-label">Cancel</span>
      </button>
    </div>
  `;
};

const generateBookmarkElement = function (bookmark) {
  if (bookmark.expanded) {
    return `
        <li class="bookmark-element js-bookmark-element" data-bookmark-id="${bookmark.id}">
          <div class="row-container">
            <button class="bookmark-title js-bookmark-title">
              <h2>${bookmark.title}</h2>
            </button>
            <div class="row-container">
              <div>
                <button class="bookmark-edit js-bookmark-edit">
                  <span class="button-label">Edit Description</span>
                </button>
              </div>
              <div>
                <button class="bookmark-delete js-bookmark-delete">
                    <span class="button-label">Delete</span>
                </button>
              </div>
            </div>
          </div>
          <div class="row-container" id="expand-${bookmark.id}">
            <div>
              <button class="visit-site js-visit-site">
                  <a href="${bookmark.url}" target="_blank">Visit ${bookmark.title}</a>
              </button>
            </div>
            <div class="bookmark-rating js-bookmark-rating">
                <h2>${bookmark.rating} Stars</h2>
            </div>
          </div>
          <div class="description js-description">
                <p>${bookmark.desc}</p>
          </div>
        </li>`;
  } else {
    return `
            <li class="bookmark-element js-bookmark-element" data-bookmark-id="${bookmark.id}">
              <div class="row-container">
                <button class="bookmark-title js-bookmark-title">
                  <h2>${bookmark.title}</h2>
                </button>
                <div class="bookmark-rating js-bookmark-rating">
                    <h2>${bookmark.rating} Stars</h2>
                </div>
              </div>
            </li>
        `;
  }
};

const generateBookmarkString = function (bookmarkList) {
  const filteredBookmarks = store.ratingFilter(bookmarkList);

  const bookmarks = filteredBookmarks.map((bookmark) =>
    generateBookmarkElement(bookmark)
  );
  return bookmarks.join("");
};

const generateError = function (message) {
  return `
    <section class="error-content row-container">
	  <button id="cancel-error">close</button>
      <h3>${message}</h3>
    </section>
  `;
};

const render = function () {
  let bookmarks = [...store.bookmarks];
  if (!store.adding) {
    const bookmarksListString = generateBookmarkString(bookmarks);
    const initialView = generateInitialView(bookmarksListString);
    $("main").html(initialView);
  } else if (store.adding) {
    const addBookmarkView = generateAddBookmarkView();
    $("main").html(addBookmarkView);
  }
};

const renderError = function () {
  if (store.error) {
    const errorMsg = generateError(store.error);
    $(".error-container").html(errorMsg);
  } else {
    $(".error-container").empty();
  }
};

const handleNewBookmark = function () {
  $("main").on("click", ".js-new-bookmark", (event) => {
    store.adding = true;
    render();
  });
};

const handleCancel = function () {
  $("main").on("click", ".js-cancel", (event) => {
    store.adding = false;
    store.setError(null);
    renderError();
    render();
  });
};

const handleCreatNewBookmark = function () {
  $("main").on("click", ".js-create", (event) => {
    event.preventDefault();
    const newUrl = $("#bookmark-url").val();
    const newTitle = $("#bookmark-title").val();
    const newRating = $("#bookmark-rating").val();
    const newDesc = $("#bookmark-desc").val();
    const newBookmarkData = {
      url: newUrl,
      title: newTitle,
      rating: newRating,
      desc: newDesc,
    };
    api
      .addNewBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookMark(newBookmark);
        store.adding = false;
        store.setError(null);
        renderError();
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const handleFilterBy = function () {
  $("main").on("submit", ".container", (event) => {
    event.preventDefault();
    store.filter = $("#min-rating").val();
    render();
  });
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark).closest(".js-bookmark-element").data("bookmark-id");
};

const handleExpand = function () {
  $("main").on("click", `.js-bookmark-title`, (event) => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.findByID(id);

    if (!bookmark.expanded) {
      store.closeAllBookMarks(bookmark);
      render();
    } else if (bookmark.expanded && event.target.className !== "button-label") {
      store.closeAllBookMarks(bookmark);
      render();
    } else {
      return true;
    }
  });
};

const handleDeleteBookmarkClicked = function () {
  $("main").on("click", ".js-bookmark-delete", (event) => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    api
      .deleteBookmark(id)
      .then(() => {
        store.findAndDeleteBookMark(id);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        console.log(error.message);
        renderError();
      });
  });
};

const handleCloseError = function () {
  $(".error-container").on("click", "#cancel-error", (event) => {
    store.setError(null);
    renderError();
  });
};

const handleEditBookmark = function () {
  $("main").on("click", ".js-bookmark-edit", (event) => {
    let desc = $(".js-description").children().get(0);
    const id = getBookmarkIdFromElement(event.currentTarget);

    if (desc.isContentEditable) {
      let newDesc = desc.textContent;
      desc.contentEditable = false;
      $(event.target).html("Edit Description");
      api
        .updateBookmark(id, { desc: newDesc })
        .then(() => {
          store.findAndUpdate(id, { desc: newDesc });
          render();
        })
        .catch((error) => {
          store.setError(error.message);
          renderError();
        });
    } else {
      desc.contentEditable = true;
      desc.focus();
      $(event.target).html("Save Edit");
    }
  });
};

const bindEventListeners = function () {
  handleNewBookmark();
  handleCancel();
  handleCreatNewBookmark();
  handleFilterBy();
  handleExpand();
  handleDeleteBookmarkClicked();
  handleCloseError();
  handleEditBookmark();
};

export default {
  render,
  bindEventListeners,
};
