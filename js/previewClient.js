let issuerEndUserList = [];
const sources = ["/resource/a0000", "/resource/b0000", "/resource/c0000"];

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
  return issuerEndUserList;
}

function renderTransferUserList() {
  let toAppend = "";
  issuerEndUserList.map((v, i) => {
    toAppend += `<option value="${v.address}">
    ${v.id} (address: ${v.address})</option>
  `;
  });
  $("#transferTargetAddress").append(toAppend);
}

function renderClientList() {}

async function getImportedUserBalance(users, access_token) {
  let result = {};
  for (let user of users) {
    // console.log(`user`, user);
    // console.log(`${}`)
    const address = user.address;
    const query = `
      query getbalance {
        explorer{
          account(address: "${address}"){
            erc20TokenBalance(first: 100){
              edges{
                node{
                  contract{
                    contract
                    name
                  }
                  owner
                  value
                }
              }
            }
          }
        }
      }
    `;
    const balance = await apiRequest(APIENDPOINT, query, access_token);
    const userBalance = balance.data.explorer.account.erc20TokenBalance.edges.map(
      e => {
        return {
          owner: e.node.owner,
          value: e.node.value,
          ...e.node.contract
        };
      }
    );
    // console.log(`balance`, userBalance);
    result[user.address] = userBalance;
  }
  // console.log(result);
  return result;
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

async function validateUser(requestUrl, voucher) {
  const endpointRules = window.localStorage.getItem("endpointRules");
  let rules;
  if (endpointRules) {
    let r = JSON.parse(endpointRules);
    if (requestUrl in r) {
      rules = r[requestUrl];
    }
  } else {
    $("small.empty-rule").css({ display: "block" });
  }

  if (rules && rules.length > 0) {
    // console.log(`rules`, rules);
    $("small.empty-rule").css({ display: "none" });
    for (let rule of rules) {
      const voucherHold = voucher.find(e => {
        return rule.target === e.contract;
      });
      if (voucherHold) {
        switch (rule.operator) {
          case ">":
            if (Number(voucherHold.value) <= Number(rule.value)) {
              return false;
            }
            break;
          case "<":
            if (Number(voucherHold.value) >= Number(rule.value)) {
              return false;
            }
            break;
          case "=":
            if (Number(voucherHold.value) !== Number(rule.value)) {
              return false;
            }
            break;
        }
      } else {
        switch (rule.operator) {
          case ">":
            return false;
          case "<":
            break;
          case "=":
            if (Number(rule.value) !== 0) {
              return false;
            }
            break;
        }
      }
    }
    return true;
  }
  // no rules, always denied
  return false;
}

async function previewRules(userBalance) {
  let result = {};
  // const rules = window.localStorage.getItem("endpointRules");
  for (let user of Object.keys(userBalance)) {
    // console.log(user);
    const voucher = userBalance[user];
    let validResult = {};
    for (let source of sources) {
      const valid = await validateUser(source, voucher);
      validResult[source] = valid;
    }
    result[user] = validResult;
  }
  // console.log(`preview:`, result);
}
