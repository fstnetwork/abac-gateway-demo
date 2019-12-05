const APIENDPOINT = `https://api.staging.fst.network/api`;
const USER_ACCESS_TOKEN = window.localStorage.getItem("user_access_token");

const ADMIN_PRIVATE_KEY =
  "0xc9725e8b55267957a958cb63fc3432cb21032c16ddc23809ab451d4218fcb634";

let attrubuteListData = [];

$(async function() {
  console.log("ready!");
  await fetchAttributeList();
  renderAttributeTable();

  renderRuleCard("/resource/a0000");
  renderRuleCard("/resource/b0000");
  renderRuleCard("/resource/c0000");
});

function renderAttributeTable() {
  attrubuteListData.map((v, i) => {
    let newRow = $("<tr>");

    var cols = "";

    cols += `<td>${i}</td>`;
    cols += `<td>${v.contract}</td>`;
    cols += `<td>${v.name}</td>`;
    cols += `<td>${v.symbol}</td>`;
    cols += `<td>${v.totalSupply}</td>`;

    cols += `<td><button type="button" class="btn btn-primary" onclick="openTransferAttribute('${v.contract}', '${v.name}', '${v.symbol}')">Transfer</button></td>`;

    newRow.append(cols);

    $("table.attribute-list").append(newRow);
  });
}

function fetchAndResponse() {}

async function publishFungibleVoucher() {
  let name = $("#vouchername").val();
  let symbol = $("#vouchersymbol").val();

  if (name == null || symbol == null) {
    return null;
  }

  const query = `mutation publishFungibleVoucher {
    publishFungibleVoucher(input: {
      name: "${name}"
      symbol: "${symbol}"
      supply: "1000"
      vendible: true
      numerator: "1000000000000000000"
      denominator: "1"
      isConsumable: true
      expiry: "1608811932"
    }){
      transaction
      submitToken
      ethereumKey
    }
  }`;

  let result = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${USER_ACCESS_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: ready to publish voucher error");
        return false;
      }
      return json.data.publishFungibleVoucher;
    });

  const adminWallet = await new ethers.Wallet(ADMIN_PRIVATE_KEY);

  result.transaction.gasLimit = result.transaction.gas;

  delete result.transaction.gas;

  const rawTransaction = await adminWallet.sign(result.transaction);

  const txHash = await submitTransaction(rawTransaction, result.submitToken);

  const targetTxLink = `https://explorer.staging.fst.network/tx/${txHash}`;

  $("#afterAttributePublish > div > div > a").attr("href", targetTxLink);

  setTimeout(async function() {
    await fetchAttributeList();
    $("#afterAttributePublish").css("display", "");
    $("table.attribute-list > tbody").empty();
    renderAttributeTable();
  }, 4000);
}

async function fetchAttributeList() {
  const query = `{
    me {
      token {
        contract
        vouchers {
          totalCount
          edges {
            node {
              contract
              name
              symbol
              totalSupply
              description
              ... on SmartVoucher20InfoField {
                standard
              }
              age
            }
          }
        }
      }
    }
  }`;

  attrubuteListData = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${USER_ACCESS_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: ready to publish voucher error");
        return false;
      }
      console.log(json);
      return json.data.me.token.vouchers.edges.map(i => {
        return { ...i.node };
      });
    });
}

let currentTransferTarget = "";

function openTransferAttribute(
  targetAttributeAddress,
  targetName,
  targetSymbol
) {
  console.log(
    "trigger target: ",
    targetAttributeAddress,
    targetName,
    targetSymbol
  );
  currentTransferTarget = targetAttributeAddress;

  $("#transferAttributeTitle").text(
    `Transfer Attribute ${targetName} (${targetSymbol})`
  );
  $("#transferAttribute").modal("show");
}

async function transferAttribute() {
  let transferValue = $("#transferValue").val();
  let transferTargetAddress = $("#transferTargetAddress").val();

  const query = `
  mutation fungibleTransfer {
    erc20Transfer(input: { contract: "${currentTransferTarget}", to: "${transferTargetAddress}", value: "${transferValue}" }) {
      transaction
      ethereumKey
      submitToken
    }
  }`;

  let result = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${USER_ACCESS_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: ready to publish voucher error");
        return false;
      }
      return json.data.erc20Transfer;
    });

  const adminWallet = await new ethers.Wallet(ADMIN_PRIVATE_KEY);

  result.transaction.gasLimit = result.transaction.gas;

  delete result.transaction.gas;

  const rawTransaction = await adminWallet.sign(result.transaction);

  const txHash = await submitTransaction(rawTransaction, result.submitToken);

  const targetTxLink = `https://explorer.staging.fst.network/tx/${txHash}`;

  $("#afterTransferResultShow > div > div > a").attr("href", targetTxLink);
  $("#afterTransferResultShow").css("display", "");
}

async function submitTransaction(rawTx, submitToken) {
  const query = `
    mutation submitTx {
      submitTransaction(input: {
        signedTx: "${rawTx}",
        submitToken: "${submitToken}"
      }){
        transactionHash
      }
    }`;

  const txHash = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${USER_ACCESS_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        console.log("error: ready to publish voucher error");
        return false;
      }

      return json.data.submitTransaction.transactionHash;
    });

  return txHash;
}

// Sample From Bosin
// async function signMessage(transaction, privateKey) {
//   let wallet = await new ethers.Wallet(privateKey);
//   return await wallet.signMessage(message);
// }

// const rulestry =  [
//   {
//     "target": "0x01f397efa26a23f143718418fae5f68320476875",
//     "operator": ">",
//     "value": "10"
//   },
//   {
//     "target": "0x6b2e0d8f8b5f8dc31a48710da06af4e92d81e9e3",
//     "operator": "<",
//     "value": "10"
//   },
//   {
//     "target": "0xdddd",
//     "operator": ">",
//     "value": "10"
//   },
//   {
//     "target": "0xdddd",
//     "operator": ">",
//     "value": "10"
//   },
//   {
//     "target": "0xdddd",
//     "operator": ">",
//     "value": "10"
//   }
// ]

// window.localStorage.getItem("endpointRules")
// window.localStorage.setItem("endpointRules")

var ENDPOINT_RULE = {
  "/resource/a0000": [
    {
      info: {
        name: "Attribute 01",
        symbol: "ATR01"
      },
      target: "0x01f397efa26a23f143718418fae5f68320476875",
      operator: ">",
      value: "5"
    },
    {
      info: {
        name: "Attribute 01",
        symbol: "ATR01"
      },
      target: "0x6b2e0d8f8b5f8dc31a48710da06af4e92d81e9e3",
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
      operator: ">",
      value: "1"
    },
    {
      info: {
        name: "Attribute 01",
        symbol: "ATR01"
      },
      target: "0x2e001629b82e556798167fe3e8d5c34c58cb2832",
      operator: "<",
      value: "2"
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
    },
    {
      info: {
        name: "Attribute 20",
        symbol: "ATR01"
      },
      target: "0x2e001629b82e556798167fe3e8d5c34c58cb2832",
      operator: "<",
      value: "2"
    },
    {
      info: {
        name: "Attribute 10",
        symbol: "ATR01"
      },
      target: "0x2e001629b82e556798167fe3e8d5c34c58cb2832",
      operator: "<",
      value: "10"
    }
  ]
};

function renderRuleCard(targetKey) {
  let targetData = ENDPOINT_RULE[targetKey];

  let newRow = $("<div>");

  let firstRow = `
  <div class="row">
    <div class="col-12">
      <h4>
        Clients who hold
      </h4>
    </div>
  </div>`;

  newRow.append(firstRow);

  targetData.map((v, i) => {
    console.log(v);
    let targetCompareText = "";
    if (v.operator == ">") {
      targetCompareText = "MORE THAN ( > )";
    } else if (v.operator == "<") {
      targetCompareText = "LESS THAN ( < )";
    } else if (v.operator == "=") {
      targetCompareText = "EQUAL TO ( = )";
    }

    if (i == 0) {
      newRow.append(`
      <div class="row pt-1">
      <div class="col">
        <ul class="shadow-sm list-group list-group-horizontal d-flex">
          <li class="list-group-item list-group-item-primary text-center"
            style="width: 12%; padding: 10px 0px 4px;">
            <span>
              <i class="material-icons" style="font-size: 32px;">
                arrow_forward
              </i>
            </span>
          </li>
          <li class="list-group-item" style="width: 45%;">${v.info.name}( ${v.info.symbol}) </li>
          <li class="list-group-item" style="width: 28%;">${targetCompareText}</li>
          <li class="list-group-item text-right" style="width: 15%">${v.value}</li>
        </ul>
      </div>
    </div>`);
    } else {
      newRow.append(`
      <div class="row pt-1">
        <div class="col">
          <ul class="shadow-sm list-group list-group-horizontal d-flex">
            <li class="list-group-item list-group-item-success text-left" style="width: 12%;">AND</li>
            <li class="list-group-item" style="width: 45%;">${v.info.name}( ${v.info.symbol})</li>
            <li class="list-group-item" style="width: 28%;">${targetCompareText}</li>
            <li class="list-group-item text-right" style="width: 15%">${v.value}</li>
          </ul>
        </div>
      </div>`);
    }
  });

  newRow.append(`
  <div class="row pt-3">
    <div class="col-12">
      <h4>
        Can Access Endpoint
      </h4>
    </div>
  </div>`);

  $(`#${targetKey.replace(/[~/]/g, "")}`).append(newRow);
}

function editRule(targetId) {
  console.log("targetid", targetId)
  $('#ruleEditModal').modal('show')
}
