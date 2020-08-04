import $ from "jquery";
import store from "./store.js";
import api from "./api.js";
import bookmarkAPP from "./bookmark.js";

const main = function () {
  api.obtainBookmark().then((bookmark) => {
    bookmark.forEach((bookmarks) => store.addBookMark(bookmarks));
    bookmarkAPP.render();
  });
  bookmarkAPP.bindEventListeners();
  bookmarkAPP.render();
};

$(main);
