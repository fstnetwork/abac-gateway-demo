// abac_dev_end_user_01

var explorerEndpoint = "https://api.staging.fst.network/explorer";
var apiEndpoint = "https://api.staging.fst.network/api";
var signInEndpoint = "https://api.staging.fst.network/signin";

var ACCESS_TOKEN = undefined;
var KEYFILE = {};
var VOUCHER = undefined;

var PRIVATE_CHEAT = {
  "0x80ade42baf46aa29643845d8230626b3788f0ebc":
    "0xc9725e8b55267957a958cb63fc3432cb21032c16ddc23809ab451d4218fcb634",
  "0x8f46d0ed30ae516102dfe8e658a3a3b6f4f469e6":
    "0x18992364b3420e9dfbdb76bdf710b6c8d27c3000e3e7135fc126eb71a21843a5",
  "0x2c0bd00d525e1a8f65ecf8861a1d3991f8e5b1f7":
    "0xc412d5d2f6b5a3495027efea4644fbcd9531db2babbda8c81ac6ddae3b839f27",
  "0x7f637fdc6749630669c792a2539aa7381092dbcb":
    "0x9bbd5b4b304bb719f3c28bd145507d23862402397cfd7cd903a6807d7395e8bc",
  "0x7e4e9d8c8771a98d237e3debdbcc78ff7e6f6ed8":
    "0x92fd8a71f5471adc33288514aeea02a6ef431158d6729e458b4f2048c5806dd8",
  "0xa271100739501a7c5f3ac0e3ce9c18c691b8935e":
    "0x8de30a15b4ad3da713239bbd1bfaa812cc6f3e7f4755820dec0e677257cdd28f"
};
var stagingExplorerUrl = "https://explorer.staging.fst.network";

window.onload = async function() {
  $("#requestBtn").click(async e => {
    e.preventDefault();
    await setLoadingTrue("response-submit-border");
    setTimeout(() => {
      $("#responseArea").text("");
      $("#signatureArea").text("");
    }, 10);
    setTimeout(() => {
      request(ACCESS_TOKEN);
    }, 10);
    await this.setLoadingFalse("response-submit-border");
    // setTimeout(() => {
    //   setLoadingFalse("response-submit-border");
    // }, 10);
  });
  $("#loginRequest").on("click", loginRequest);
  $("#selectResourceUrl").on("change", async function() {
    // const requestUrl = $("selectResourceUrl").text();
    if (ACCESS_TOKEN) {
      const privateKey = PRIVATE_CHEAT[KEYFILE.address];
      const signature = await signMessage(this.value, privateKey);
      $("#resourceUrlInput").val(`${this.value}?ds=${signature}`);
    }
  });
};

async function loginRequest() {
  const userId = $("#exampleInputId").val();
  const pwd = $("#exampleInputPassword").val();

  const accessToken = await login(userId, pwd);

  if (accessToken) {
    ACCESS_TOKEN = accessToken;
    $("#exampleModal").modal("toggle");

    $("#accessTokenPanel").text(accessToken);

    const ethereum = await getEthereumInfo(accessToken);
    $("#etherAddressAnchor").text(ethereum.address);
    $("#etherAddressAnchor").attr(
      "href",
      `${stagingExplorerUrl}/address/${ethereum.address}`
    );
    KEYFILE = ethereum;

    const voucherData = await getVoucherData(accessToken);
    VOUCHER = voucherData;

    return accessToken;
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
  if (response.data.signIn.access_token) {
    return response.data.signIn.access_token;
  }
  return undefined;
}

async function getEthereumInfo(accessToken) {
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

async function request(accessToken) {
  const requestUrl = $("#selectResourceUrl").val();
  console.log(`reuqestUrl: ${requestUrl}`);

  // localStorage.setItem("myCat", "Tom");

  // let query = `query account{account(address: "${KEYFILE.address}"){etherBalance}}`;
  // const gqlRes = await apiRequest(explorerEndpoint, query);
  // $("#responseArea").text(JSON.stringify(gqlRes.data, null, 2));

  // const privateKey = await getPrivateKey(KEYFILE, "abac_dev_end_user_01");
  // const privateKey = PRIVATE_CHEAT[KEYFILE.address];
  // const signature = await signMessage(requestUrl, privateKey);
  // $("#signatureArea").text(signature);
  if (accessToken) {
    const validateResult = await validateUser(requestUrl, VOUCHER);
    if (validateResult) {
      $("#responseArea").text(
        JSON.stringify(
          {
            result: requestUrl,
            status: "OK"
          },
          null,
          2
        )
      );
    } else {
      $("#responseArea").text(
        JSON.stringify(
          {
            result: null,
            status: "PERMISSION_DENIED"
          },
          null,
          2
        )
      );
    }
  }
}

async function getVoucherData(accessToken) {
  const query = `
  {
    me {
      fungibleVoucherBalance(issuer: "0x80ade42baf46aa29643845d8230626b3788f0ebc") {
        edges {
          node {
            contract {
              contract
              name
              symbol
            }
            owner
            value
          }
        }
      }
    }
  }
  `;

  if (accessToken) {
    let voucherData;
    const voucherResponse = await apiRequest(apiEndpoint, query, accessToken);
    if (voucherResponse.data.me.fungibleVoucherBalance.edges) {
      voucherData = voucherResponse.data.me.fungibleVoucherBalance.edges.map(
        e => {
          return {
            owner: e.node.owner,
            value: e.node.value,
            ...e.node.contract
          };
        }
      );
      if (voucherData.length && voucherData.length > 0) {
        $("#voucherTableBody").empty();
      }
      for (let node of voucherData) {
        let tr = `
          <tr>
            <td>${node.name}(${node.symbol})</td>
            <td>${node.contract}</td>
            <th scope="row">${node.value}</th>
          </tr>`;
        $("#voucherTableBody").append(tr);
      }
      return voucherData;
    }
    return;
  }
  return;
}

async function validateUser(requestUrl) {
  const rules = [
    {
      target: "0xde95f682f6cfe019929f779564f06e39627686d5",
      operator: ">",
      value: "5"
    },
    {
      target: "0x01f397efa26a23f143718418fae5f68320476875",
      operator: "<",
      value: "2"
    }
  ];

  for (let rule of rules) {
    const voucherHold = VOUCHER.find(e => {
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
          if (Number(voucherHold.value) != Number(rule.value)) {
            return false;
          }
          break;
      }
    } else {
      return false;
    }
  }
  return true;
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

async function setLoadingTrue(id) {
  $(`#${id}`).addClass("spinner-border");
}

async function setLoadingFalse(id) {
  $(`#${id}`).removeClass("spinner-border");
}

async function setVisible(id) {
  $(`#${id}`).removeClass("invisible");
  $(`#${id}`).addClass("visible");
}

async function getPrivateKey(keyfile, passphrase) {
  return await window.EthKeyLibBrowser.DecryptEthereumKeyJson(
    passphrase,
    keyfile
  );
}

async function signMessage(message, privateKey) {
  let wallet = await new ethers.Wallet(privateKey);
  return await wallet.signMessage(message);
}

async function recoverSignature(message, flatSig) {
  let abi = [
    "function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)"
  ];
  let provider = ethers.getDefaultProvider("ropsten");
  let contractAddress = "0x80F85dA065115F576F1fbe5E14285dA51ea39260";
  let contract = new ethers.Contract(contractAddress, abi, provider);

  let sig = ethers.utils.splitSignature(flatSig);
  return await contract.verifyString(message, sig.v, sig.r, sig.s);
}
