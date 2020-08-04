"use strict";

const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

function addBookMark(bookmark) {
  this.bookmarks.push(bookmark);
}

function findAndDeleteBookMark(id) {
  this.bookmarks = this.bookmarks.filter(
    (currentBookmark) => currentBookmark.id !== id
  );
}

function findByID(id) {
  return this.bookmarks.find((currentBookmark) => currentBookmark.id === id);
}

function ratingFilter(list) {
  return list.filter((Bookmark) => Bookmark.rating >= this.filter);
}

function setError(newError) {
  this.error = newError;
}

function findAndUpdate(id, newData) {
  let currentBookmark = this.findByID(id);
  Object.assign(currentBookmark, newData);
}

function closeAllBookMarks(bookmark) {
  bookmark.expanded = !bookmark.expanded;
}

export default {
  addBookMark,
  findAndDeleteBookMark,
  findByID,
  ratingFilter,
  setError,
  findAndUpdate,
  closeAllBookMarks,
  bookmarks,
  adding,
  filter,
  error,
};
