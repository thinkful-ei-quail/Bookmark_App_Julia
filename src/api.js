"use strict";
const BookmarkAPI =
  "https://thinkful-list-api.herokuapp.com/juliabugayev/bookmarks";

//...arg takes multiple arguments

const apiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then((Response) => {
      if (!Response.ok) {
        error = { code: Response.status };

        if (!Response.headers.get("content-type").includes("json")) {
          error.message = Response.statusText;
          return Promise.reject(error);
        }
      }
      return Response.json();
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

function deleteBookmark(id) {
  return apiFetch(`${BookmarkAPI}/${id}`, {
    method: "DELETE",
  });
}

function updateBookmark(id, updateInfo) {
  const update = JSON.stringify(updateInfo);
  return apiFetch(`${BookmarkAPI}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: update,
  });
}

function addNewBookmark(bookmark) {
  const addBookmark = JSON.stringify(bookmark);
  return apiFetch(`${BookmarkAPI}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: addBookmark,
  });
}

function obtainBookmark() {
  return apiFetch(`${BookmarkAPI}`);
}

export default {
  deleteBookmark,
  obtainBookmark,
  addNewBookmark,
  updateBookmark,
};
