const BASE_URL = "/login";

/* View References */
const USERNAME_VIEW = document.querySelector("#username");
const PASSWORD_VIEW = document.querySelector("#password");
const MESSAGE_VIEW = document.querySelector("#message");
const LOGIN_BUTTON_VIEW = document.querySelector("#login");

async function authenticate() {
  const credentials = {
    username: USERNAME_VIEW.value,
    password: PASSWORD_VIEW.value,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(BASE_URL, options);
  let result = await response.json();

  MESSAGE_VIEW.value = result.message;
}

/* Register Handlers */
LOGIN_BUTTON_VIEW.addEventListener("click", (event) => {
  event.preventDefault();
  authenticate().then(() => {});
});
