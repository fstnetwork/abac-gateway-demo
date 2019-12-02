async function doLogin() {
  let SIGNINENDPOINT = `https://api.staging.fst.network/signin`;

  let email = $("#loginId").val();
  let password = $("#loginPassword").val();

  let signinQuery = `
    mutation signIn {
      signIn(input: { id: "${email}", password: "${password}"}) {
        access_token
      }
    }`;

  let signinBody = {
    query: signinQuery
  };

  console.log(signinBody);

  const result = await fetch(SIGNINENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify(signinBody),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: sign in error");
        return false;
      }
      return json;
    });

  if (result == false) {
    console.log("Log in fail");
  }

  window.localStorage.setItem(
    "user_access_token",
    result.data.signIn.access_token
  );
}
