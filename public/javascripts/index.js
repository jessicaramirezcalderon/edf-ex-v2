import axios from "axios";
import localforage from "localforage";
import { setupCache } from "axios-cache-adapter";

const container = document.getElementById("client-side-stuff");

const forageStore = localforage.createInstance({
  // List of drivers used
  driver: [localforage.LOCALSTORAGE],
  // Prefix all storage keys to prevent conflicts
  name: "edf",
});

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 30 * 1000,
  store: forageStore,
});

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
});

const renderPosts = (posts) => {
  let html = "";
  posts.forEach((post) => {
    html += `
      <div>
        <p>User ID: ${post.userId}</p>
        <p>ID: ${post.id}</p>
        <p>Title: ${post.title}</p>
        <p>Body: ${post.body}</p>
      </div>
    `;
  });
  container.innerHTML = html;
};

const getPosts = () => {
  // Send a GET request to some REST api
  api({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "get",
  }).then((response) => {
    console.log(response);
    renderPosts(response.data);
  });
};

getPosts();
setInterval(getPosts, 60000);
