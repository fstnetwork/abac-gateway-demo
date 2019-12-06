async function loginAdmin() {
  const userId = $("#exampleInputId").val();
  const pwd = $("#exampleInputPassword").val();

  const accessToken = await login(userId, pwd);

  if (accessToken) {
    window.localStorage.setItem("admin_access_token", accessToken);
    ADMIN_ACCESS_TOKEN = window.localStorage.getItem("admin_access_token");
    ADMIN_ID = window.localStorage.getItem("admin_id");
    const ethereum = await getEthereumInfo(accessToken);

    ADMIN_PRIVATE_KEY = ADMIN_PRIVATE_CHEAT[ethereum.address];


    window.location.reload();
  } else {
    $("div.invalid-login").css({ display: "block" });
  }
  return;
}

async function login(id, pwd) {
  window.localStorage.setItem("admin_id", id);
  $("#login").css({ display: "none" });
  $("#logout").css({ display: "block" });

  var signInEndpoint = "https://api.staging.fst.network/signin";

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

async function getEthereumInfo(accessToken) {
  var apiEndpoint = "https://api.staging.fst.network/api";

  if (accessToken) {
    const query = `
    query ethereum {
      ethereumKey{
        address
        crypto
        version
      }
    }
    `;
    const response = await apiRequest(apiEndpoint, query, accessToken);
    if (response.data.ethereumKey) {
      return response.data.ethereumKey;
    }
  }
  return;
}
