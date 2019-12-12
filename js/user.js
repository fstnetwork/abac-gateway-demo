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
    "0x8de30a15b4ad3da713239bbd1bfaa812cc6f3e7f4755820dec0e677257cdd28f",
  "0xdad7a7460748626e72254653a50c8cb85a56e08e":
    "0xbd543d32c8f249877e2677e6a2c24fa0df37120a292164e48e971ce351364fa7",
  "0x84e743b77653f6806c937ecaba5ef76fb7827a80":
    "0x242891ddf8f076e65b680839767594df89bdf0ef253fbed65fd2e8964543249e",
  "0x161477032cbffff28c4252905d78eff8d1af0431":
    "0xfe34b53487f2b293d462b831abbee2cbcc1326475a7c8d44796dbe208549bcb9",
  "0x64e5a1f11c9d96cc458e1c6a986f02e5cddcc2c7":
    "0xf979d7a89e6b6e7be80d6d65c14c71b3501bdfbe1d1d7936cb71c3dd3cef799a",
  "0x4dc73491a7cf7f1742cbe3dd90a57b74edf09b65":
    "0x91374045929e70bbc653fb36d5a9dda5686384e574cf12af481d26308be22a82",
  "0xa302e50e9959fca3c576178e98957365ad0d0890":
    "0xe668ba8df6182212757a0f4b4b842f27229e01fd6fe525c6e60bb81453a10f8a"
};
var stagingExplorerUrl = "https://explorer.staging.fst.network";

(function(CHEAT) {
  const EXTRA_CHEAT = [
    {
      addressString: "0x09b6beffdbade9530a3fd0f403a7a9028bc6312e",
      checksumAddressString: "0x09b6bEfFdbade9530a3fd0f403A7a9028bC6312e",
      privateKeyString:
        "bde521dc43746685f7da348c89b3644db86256c8b315a71945442cea46e21657"
    },
    {
      addressString: "0x14e529e2a331e89b79eb0692732075857145db7b",
      checksumAddressString: "0x14E529e2A331e89B79EB0692732075857145db7B",
      privateKeyString:
        "9e69cb1dca974b4bf858cceeccb97403cd8f74d0fd818c04b37acce7abc17e13"
    },
    {
      addressString: "0x7aedbd9df6223a5a0bd8d0e48c88c90c07753bc4",
      checksumAddressString: "0x7AEdbD9dF6223a5A0BD8D0E48c88c90c07753Bc4",
      privateKeyString:
        "d91dad0c5be2216cfe1c04454d90fc0da70b2fbc86588e123a9183b5868959b6"
    },
    {
      addressString: "0x3d6dcdf58a87aca5632637fa38b5f748b9fe29ce",
      checksumAddressString: "0x3D6dCdf58a87ACa5632637Fa38b5F748b9fe29CE",
      privateKeyString:
        "0bc20e7f6e6fd3ee7150307d1dbefbde2be4ca5c5884ae37d4c7cafd58d807e5"
    },
    {
      addressString: "0x6d82c4ce786e3762b5e19d5d25407cdb92506b57",
      checksumAddressString: "0x6D82C4cE786e3762b5e19D5D25407CDB92506b57",
      privateKeyString:
        "2da03697ed677166eb5c2a531ebece5d83f8008082540196306f3c668e2f96d9"
    },
    {
      addressString: "0x477f778a1a8ad42d249afa528ab56cc42e789a2e",
      checksumAddressString: "0x477F778A1A8aD42d249afA528AB56CC42E789a2E",
      privateKeyString:
        "52b145b991b37dff262dab26a215cac68e2214cc7dacfae08dde9a5d3be6e0c9"
    },
    {
      addressString: "0x7dd38b785c471bb8ae454dc0a52c4b2d2f115aa0",
      checksumAddressString: "0x7dd38b785C471Bb8ae454dc0A52c4b2d2f115Aa0",
      privateKeyString:
        "c624d601914060e7b033234baf6231454334a0317ba7615ebbd9fd9b718b1471"
    },
    {
      addressString: "0xf79ea0c56dc60705e8d4a3941ff1df9c84830318",
      checksumAddressString: "0xF79EA0c56Dc60705e8D4A3941FF1Df9C84830318",
      privateKeyString:
        "43d299c0bc57355f3f543a5cfef15eb985e9a2691d40149611762ba1810a124c"
    },
    {
      addressString: "0xdbc49bb1a5e19acd5a925e0f877426c80ea28f3e",
      checksumAddressString: "0xDBC49bB1a5E19Acd5A925e0F877426c80ea28F3e",
      privateKeyString:
        "32129500033729b6c159f343314b5e83249faebe7c923255bacbe87e9eb8f82d"
    }
  ];

  EXTRA_CHEAT.forEach(o => {
    CHEAT[o.addressString] = "0x" + o.privateKeyString;
  });
})(PRIVATE_CHEAT);

window.onload = async function() {
  const accessToken = window.localStorage.getItem("USER_ACCESS_TOKEN");
  const userId = window.localStorage.getItem("USER_ID");

  $("#logout").css({ display: "none" });

  if (accessToken) {
    $("#logout").css({ display: "block" });
    $("#login").css({ display: "none" });
    console.log("login already:", accessToken, userId);
    const exp = getTokenExpiry();
    if (notExpired(exp)) {
      console.log("token valid");
      ACCESS_TOKEN = accessToken;
      await getUserInfo(accessToken);
    } else {
      console.log("token invalid, logout");
      window.localStorage.removeItem("USER_ACCESS_TOKEN");
      window.localStorage.removeItem("USER_ID");
    }

    $("#logoutRequest").on("click", () => {
      localStorage.removeItem("USER_ACCESS_TOKEN");
      localStorage.removeItem("USER_ID");
      location.reload();

      $("#logoutModal").modal("hide");
    });

    $("#logoutClose").on("click", () => {
      $("#logoutModal").modal("hide");
    });
  } else {
    $("#exampleModal").modal("show");
  }

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
    await setLoadingFalse("response-submit-border");
  });

  $("#loginRequest").on("click", loginRequest);

  $("#loginClose").on("click", () => {
    $("#exampleModal").modal("hide");
    // close with clear login info
    $("div.invalid-login").css({ display: "none" });
    $("#exampleInputId").val("");
    $("#exampleInputPassword").val("");
  });

  $("#selectResourceUrl").on("change", async function() {
    // const requestUrl = $("selectResourceUrl").text();
    if (ACCESS_TOKEN && this.value.startsWith("/resource")) {
      const privateKey = PRIVATE_CHEAT[KEYFILE.address];
      const requestId = _uuid();
      console.log(this.value, requestId, privateKey);
      const signature = await signMessage(this.value, requestId, privateKey);
      $("#resourceUrlInput").val(`${this.value}?ds=${signature}`);
      $("#requestIdArea").text(`request Id: ${requestId}`);
    } else {
      $("#resourceUrlInput").val("");
      $("#requestIdArea").text(``);
    }
    $("#responseArea").text("");
  });

  $("#logoutRequest").on("click", () => {
    localStorage.removeItem("USER_ACCESS_TOKEN");
    localStorage.removeItem("USER_ID");
    location.reload();

    $("#logoutModal").modal("hide");
  });

  $("#logoutClose").on("click", () => {
    $("#logoutModal").modal("hide");
  });
};

async function loginRequest() {
  const userId = $("#exampleInputId").val();
  const pwd = $("#exampleInputPassword").val();

  const accessToken = await login(userId, pwd);

  $("#login").css({ display: "none" });
  $("#logout").css({ display: "block" });

  if (accessToken) {
    ACCESS_TOKEN = accessToken;
    window.localStorage.setItem("USER_ACCESS_TOKEN", accessToken);
    window.localStorage.setItem("USER_ID", userId);
    getTokenExpiry();

    $("div.invalid-login").css({ display: "none" });
    $("#exampleModal").modal("toggle");

    getUserInfo(accessToken);

    // $("#userName").text(userId);
    // $("#dataEntry").text(`${userId}'s Data Entry:`);
    // // $("#accessTokenPanel").text(accessToken);
    // $("#requestBtn").prop("disabled", false);
    // $("#selectResourceUrl").prop("disabled", false);

    // const ethereum = await getEthereumInfo(accessToken);
    // $("#etherAddressAnchor").text(ethereum.address);
    // $("#etherAddressAnchor").attr(
    //   "href",
    //   `${stagingExplorerUrl}/address/${ethereum.address}`
    // );
    // KEYFILE = ethereum;

    // await setIntervalToGetVoucherData(accessToken);
    // // VOUCHER = voucherData;

    // setDefault();

    return accessToken;
  } else {
    $("div.invalid-login").css({ display: "block" });
  }
  return;
}

async function getUserInfo(accessToken) {
  const userId = window.localStorage.getItem("USER_ID");

  $("#userName").text(userId);
  $("#dataEntry").text(`${userId}'s Data Entry:`);
  // $("#accessTokenPanel").text(accessToken);
  $("#requestBtn").prop("disabled", false);
  $("#selectResourceUrl").prop("disabled", false);

  const ethereum = await getEthereumInfo(accessToken);
  $("#etherAddressAnchor").text(ethereum.address);
  $("#etherAddressAnchor").attr(
    "href",
    `${stagingExplorerUrl}/address/${ethereum.address}`
  );
  KEYFILE = ethereum;

  await setIntervalToGetVoucherData(accessToken);
  // VOUCHER = voucherData;

  setDefault();
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
  console.log(`login response`, response);
  if (response.data.signIn && response.data.signIn.access_token) {
    return response.data.signIn.access_token;
  }
  return undefined;
}

async function getEpochNow() {
  const dateTime = Date.now();
  return Math.floor(dateTime / 1000);
}

function getTokenExpiry() {
  const accessToken = localStorage.getItem("USER_ACCESS_TOKEN");
  const decoded = jwt_decode(accessToken);
  if (decoded) {
    return decoded.exp;
  }
}

async function notExpired(exp) {
  const now = getEpochNow();
  if (exp < now) {
    return false;
  }
  return true;
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
    const validateResult = await validateUser(requestUrl);
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

async function setIntervalToGetVoucherData(accessToken) {
  VOUCHER = await getVoucherData(accessToken);

  setInterval(async function() {
    // console.log(`not expiry with access token`);
    VOUCHER = await getVoucherData(accessToken);
  }, 5000);
}

async function getVoucherData(accessToken) {
  const endUsers2IssuerMap = {
    "0xdad7a7460748626e72254653a50c8cb85a56e08e":
      "0x7f637fdc6749630669c792a2539aa7381092dbcb",
    "0x84e743b77653f6806c937ecaba5ef76fb7827a80":
      "0x7f637fdc6749630669c792a2539aa7381092dbcb",
    "0x64e5a1f11c9d96cc458e1c6a986f02e5cddcc2c7":
      "0x80ade42baf46aa29643845d8230626b3788f0ebc",
    "0x161477032cbffff28c4252905d78eff8d1af0431":
      "0x80ade42baf46aa29643845d8230626b3788f0ebc",
    "0x4dc73491a7cf7f1742cbe3dd90a57b74edf09b65":
      "0x4923d0ef0adec78500f39c934524e88d8354b332",
    "0xa302e50e9959fca3c576178e98957365ad0d0890":
      "0x4923d0ef0adec78500f39c934524e88d8354b332",
    "0x3d6dcdf58a87aca5632637fa38b5f748b9fe29ce":
      "0x09b6beffdbade9530a3fd0f403a7a9028bc6312e",
    "0x6d82c4ce786e3762b5e19d5d25407cdb92506b57":
      "0x09b6beffdbade9530a3fd0f403a7a9028bc6312e",
    "0x477f778a1a8ad42d249afa528ab56cc42e789a2e":
      "0x14e529e2a331e89b79eb0692732075857145db7b",
    "0x7dd38b785c471bb8ae454dc0a52c4b2d2f115aa0":
      "0x14e529e2a331e89b79eb0692732075857145db7b",
    "0xf79ea0c56dc60705e8d4a3941ff1df9c84830318":
      "0x7aedbd9df6223a5a0bd8d0e48c88c90c07753bc4",
    "0xdbc49bb1a5e19acd5a925e0f877426c80ea28f3e":
      "0x7aedbd9df6223a5a0bd8d0e48c88c90c07753bc4"
  };

  const query = `
  {
    me {
      fungibleVoucherBalance(issuer: "${
        endUsers2IssuerMap[KEYFILE.address.toLowerCase()]
      }") {
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
            <td>
              <a
                href='${stagingExplorerUrl}/token/${node.contract}'
                target='_blank'>${node.contract}</a>
            </td>
            <th scope="row">${node.value}</th>
          </tr>`;
        $("#voucherTableBody").append(tr);
      }
      // VOUCHER = voucherData;
      return voucherData;
    }
    return;
  }
  return;
}

async function validateUser(requestUrl) {
  // const rules = [
  //   {
  //     target: "0xde95f682f6cfe019929f779564f06e39627686d5",
  //     operator: ">",
  //     value: "5"
  //   },
  //   {
  //     target: "0x01f397efa26a23f143718418fae5f68320476875",
  //     operator: "<",
  //     value: "2"
  //   }
  // ];
  // setTempRules();

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

function setDefault() {
  $("#selectResourceUrl").val("");
  $("#resourceUrlInput").val("");
  $("#responseArea").text("");
  $("#exampleInputId").val("");
  $("#exampleInputPassword").val("");
}

async function getPrivateKey(keyfile, passphrase) {
  return await window.EthKeyLibBrowser.DecryptEthereumKeyJson(
    passphrase,
    keyfile
  );
}

async function signMessage(message, id, privateKey) {
  let wallet = await new ethers.Wallet(privateKey);
  let message2sign = `id=${id}&path=${message}`;
  return await wallet.signMessage(message2sign);
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

function _uuid() {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function setTempRules() {
  let ENDPOINT_RULE = {
    "/resource/a0000": [
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0xde95f682f6cfe019929f779564f06e39627686d5",
        operator: ">",
        value: "5"
      },
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0x01f397efa26a23f143718418fae5f68320476875",
        operator: "<",
        value: "2"
      }
    ],
    "/resource/b0000": [
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0xb146d4fbd396d1fdbbec03b0bc1487fdf8e5f137",
        operator: "<",
        value: "1"
      },
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0x2e001629b82e556798167fe3e8d5c34c58cb2832",
        operator: "<",
        value: "1"
      }
    ],
    "/resource/c0000": [
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0x1a379ae0197cc9ccdadadd4f0500bef08a5a0680",
        operator: ">",
        value: "1"
      },
      {
        info: {
          name: "Attribute 01",
          symbol: "ATR01"
        },
        target: "0xde95f682f6cfe019929f779564f06e39627686d5",
        operator: "<",
        value: "2"
      }
    ]
  };
  const rules = JSON.stringify(ENDPOINT_RULE);
  window.localStorage.setItem("endpointRules", rules);
  // window.localStorage.clear();
}
