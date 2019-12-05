var signInEndpoint = "https://api.staging.fst.network/signin";

async function loginAdmin() {
  const userId = $("#exampleInputId").val();
  const pwd = $("#exampleInputPassword").val();

  const accessToken = await login(userId, pwd);

  if (accessToken) {
    window.localStorage.setItem("admin_access_token", accessToken);
    ADMIN_ACCESS_TOKEN = window.localStorage.getItem("admin_access_token");
    window.location.reload();
  } else {
    $("div.invalid-login").css({ display: "block" });
  }
  return;
}

async function login(id, pwd) {
  const query = `
    mutation signIn{
      signIn(input: {
        id: "${id}"
        password: "${pwd}"
      }){
        access_token
      }
    }
  `;

  const response = await apiRequest(signInEndpoint, query);
  if (response.data.signIn && response.data.signIn.access_token) {
    return response.data.signIn.access_token;
  }
  return undefined;
}

async function apiRequest(endpoint, query, accessToken) {
  return fetch(endpoint, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query: `${query}` }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`
          }
        : {})
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.error("apifetch error", json.error);
      }
      return json;
    });
}
