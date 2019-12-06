let issuerEndUserList = [];

async function fetchClientList(access_token) {
  const query = `
  {
    getImportedUser(first: 100, after: "") {
      totalCount
      edges {
        node {
          id
          role
          importedBy
          firstName
          lastName
          email
          phone
          address
        }
      }
    }
  }`;

  issuerEndUserList = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${access_token}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: ready to  voucher error");
        return false;
      }
      console.log(json);
      return json.data.getImportedUser.edges.map(i => {
        return { ...i.node };
      });
    });
  console.log(issuerEndUserList);
}

function renderTransferUserList() {
  $("#transferTargetAddress").empty();
  let toAppend = "";
  issuerEndUserList.map((v, i) => {
    toAppend += `<option value="${v.address}">
    ${v.id} (address: ${v.address})</option>
  `;
  });
  $("#transferTargetAddress").append(toAppend);
}

function renderClientList() {}
