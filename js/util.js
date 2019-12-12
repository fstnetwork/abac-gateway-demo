const APIENDPOINT = `https://api.staging.fst.network/api`;
let ADMIN_ACCESS_TOKEN = window.localStorage.getItem("admin_access_token");
let ADMIN_ID = window.localStorage.getItem("admin_id");

const ADMIN_PRIVATE_CHEAT = {
  "0x80ade42baf46aa29643845d8230626b3788f0ebc":
    "0xc9725e8b55267957a958cb63fc3432cb21032c16ddc23809ab451d4218fcb634",
  "0x7f637fdc6749630669c792a2539aa7381092dbcb":
    "0x9bbd5b4b304bb719f3c28bd145507d23862402397cfd7cd903a6807d7395e8bc",
  "0x4923d0ef0adec78500f39c934524e88d8354b332":
    "0xde5c2b084da96068c75d231df243396bee7a4d85235e23a047ff801e0aef72c5"
};

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
})(ADMIN_PRIVATE_CHEAT);

let ADMIN_PRIVATE_KEY = "";

let attributeListData = [];
var ENDPOINT_RULE = JSON.parse(window.localStorage.getItem("endpointRules"));
let previewRulesData = {};

$(async function() {
  console.log(ADMIN_ID);

  if (ADMIN_ACCESS_TOKEN == null && ADMIN_ID == null) {
    $("#logout").css({ display: "none" });
    $("#exampleModal").modal("show");
  } else {
    $("#username").text(ADMIN_ID);
    $("#logout").css({ display: "block" });
    $("#login").css({ display: "none" });
    let ethereum = await getEthereumInfo(ADMIN_ACCESS_TOKEN);
    ADMIN_PRIVATE_KEY = ADMIN_PRIVATE_CHEAT[ethereum.address];
    await fetchAttributeList();
    // console.log(`attribute:`, attributeListData);
    await fetchClientList(ADMIN_ACCESS_TOKEN);

    const users = await fetchClientList(ADMIN_ACCESS_TOKEN);
    const userBalance = await getImportedUserBalance(users, ADMIN_ACCESS_TOKEN);
    // console.log(userBalance);
    previewRulesData = await previewRules(userBalance);
    setInterval(async () => {
      const userBalance = await getImportedUserBalance(
        users,
        ADMIN_ACCESS_TOKEN
      );
      // console.log(userBalance);
      previewRulesData = await previewRules(userBalance);
      // console.log(`preview`, previewRulesData);
    }, 5000);
  }

  renderTransferUserList();
  renderAttributeTable();

  if (ENDPOINT_RULE == null) {
    ENDPOINT_RULE = {
      "/resource/a0000": [],
      "/resource/b0000": [],
      "/resource/c0000": []
    };
  }

  renderRuleCard("/resource/a0000");
  renderRuleCard("/resource/b0000");
  renderRuleCard("/resource/c0000");

  $("#previewBtn").on("click", () => {
    $("#previewUserRuleModal").modal("show");
    $("#previewUserPre").text(JSON.stringify(previewRulesData, null, 2));
  });
  $("#previewUserClose").on("click", () => {
    $("#previewUserRuleModal").modal("hide");
  });
});

function adminlogout() {
  window.localStorage.removeItem("admin_access_token");
  window.localStorage.removeItem("admin_id");
  window.localStorage.removeItem("endpointRules");
  window.location.reload();
}

function renderAttributeTable() {
  attributeListData.map((v, i) => {
    let newRow = $("<tr>");

    var cols = "";

    cols += `<td>${i}</td>`;
    cols += `<td><a href="https://explorer.staging.fst.network/token/${v.contract}" target="_blank">${v.contract}</a></td>`;
    cols += `<td>${v.name}</td>`;
    cols += `<td>${v.symbol}</td>`;
    cols += `<td>${numberWithCommas(v.totalSupply)}</td>`;

    cols += `<td><button type="button" class="btn btn-primary" onclick="openTransferAttribute('${v.contract}', '${v.name}', '${v.symbol}')">Transfer</button></td>`;

    newRow.append(cols);

    $("table.attribute-list").append(newRow);
  });
}

async function openAddAttribute() {
  $("#afterAttributePublish").css("display", "none");
  $("#attributeSubmitButton")
    .html("Submit")
    .removeAttr("disabled")
    .removeClass("btn-secondary")
    .addClass("btn-primary")
    .css("cursor", "pointer");
  $("#attributeCancelButton").html("Cancel");
  $("#vouchername")
    .removeAttr("disabled")
    .val("");
  $("#vouchersymbol")
    .removeAttr("disabled")
    .val("");
}

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
      authorization: `Bearer ${ADMIN_ACCESS_TOKEN}`
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

  $("#attributeSubmitButton")
    .html("Submitted")
    .attr("disabled", "true")
    .removeClass("btn-primary")
    .addClass("btn-secondary")
    .css("cursor", "not-allowed");
  $("#attributeCancelButton").html("Close");
  $("#vouchername").attr("disabled", "disabled");
  $("#vouchersymbol").attr("disabled", "disabled");

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

  attributeListData = await fetch(APIENDPOINT, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${ADMIN_ACCESS_TOKEN}`
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
  renderTransferUserList();

  $("#afterTransferResultShow").css("display", "none");
  $("#transferAttributeSubmitButton")
    .html("Submit")
    .removeAttr("disabled")
    .removeClass("btn-secondary")
    .addClass("btn-primary")
    .css("cursor", "pointer");
  $("#transferAttributeCancelButton").html("Cancel");
  $("#transferValue")
    .removeAttr("disabled")
    .val("0");
  $("#transferTargetAddress").removeAttr("disabled");

  console.log(
    "trigger target: ",
    targetAttributeAddress,
    targetName,
    targetSymbol
  );
  currentTransferTarget = targetAttributeAddress;

  $("#transferAttributeTitle").text(
    `Transfer attribute: ${targetName} (${targetSymbol})`
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
      authorization: `Bearer ${ADMIN_ACCESS_TOKEN}`
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
  $("#transferAttributeSubmitButton")
    .html("Submitted")
    .attr("disabled", "true")
    .removeClass("btn-primary")
    .addClass("btn-secondary")
    .css("cursor", "not-allowed");
  $("#transferAttributeCancelButton").html("Close");
  $("#transferValue").attr("disabled", "disabled");
  $("#transferTargetAddress").attr("disabled", "disabled");
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
      authorization: `Bearer ${ADMIN_ACCESS_TOKEN}`
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

function renderRuleCard(targetKey) {
  let targetData = ENDPOINT_RULE[targetKey];

  let newRow = $("<div>");

  let firstRow = `
  <div class="row">
    <div class="col">
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
      <h6 style="color: rgb(128, 122, 122)">
        can access to the resource endpoint
      </h6>
    </div>
  </div>`);

  $(`#${targetKey.replace(/[~/]/g, "")}`).empty();
  $(`#${targetKey.replace(/[~/]/g, "")}`).append(newRow);
}

let currentEditTargetId = "";
let editRuleRenderId = 0;

function editRule(targetId) {
  $("#ruleEditModalTitle").empty();
  $("#ruleEditModalTitle").append(`Edit endpoint ${targetId} ABAC rule`);

  let targetDataArray = ENDPOINT_RULE[targetId];

  currentEditTargetId = targetId;

  $("#ruleEditModalBody").empty();
  targetDataArray.map((v, i) => {
    let newRow = $("<div>")
      .addClass("input-group")
      .addClass("shadow-sm");
    newRow.append(renderTargetSelect(v.target, i));
    newRow.append(renderOperatorSelect(v.operator, i));
    newRow.append(renderValueInput(v.value, i));
    newRow.append(renderValueTag(v.info.symbol, i));

    let collevel = $(`<div>`)
      .addClass("col-12")
      .append(newRow);
    let lastRowlevel = $("<div>")
      .addClass("rows")
      .addClass("pt-2")
      .attr("id", `wrappingrow${i}`)
      .append(collevel);
    $("#ruleEditModalBody").append(lastRowlevel);
  });

  editRuleRenderId = targetDataArray.length;

  $("#ruleEditModal").modal("show");
}

function addRule() {
  let i = ++editRuleRenderId;

  let newRow = $("<div>").addClass("input-group", "mb-3");
  newRow.append(renderTargetSelect("", i));
  newRow.append(renderOperatorSelect("", i));
  newRow.append(renderValueInput(0, i));
  newRow.append(renderValueTag("", i));
  let collevel = $(`<div>`)
    .addClass("col-12")
    .append(newRow);
  let lastRowlevel = $("<div>")
    .addClass("rows")
    .addClass("pt-2")
    .attr("id", `wrappingrow${i}`)
    .append(collevel);

  $("#ruleEditModalBody").append(lastRowlevel);
}

function removerulebyindex(index) {
  console.log("remove: ", index);
  $(`#ruleEditModalBody > #wrappingrow${index}`).remove();
  // allMember[index].remove();
}

// function renderPrependTag(order) {
//   if (order == 0) {
//     return `
//       <div class="input-group-prepend">
//         <span class="input-group-text text-primary  border-primary" id="targetRule${order}">
//           <i class="material-icons">
//             arrow_forward
//           </i>
//         </span>
//       </div>`;
//   } else {
//     return `
//       <div class="input-group-prepend">
//         <span class="input-group-text text-success  border-success" id="targetRule${order}">AND</span>
//       </div>`;
//   }
// }

function renderTargetSelect(targetContractAddress, order) {
  let selectPart = $("<select>")
    .addClass("custom-select")
    .addClass("rule-target")
    .attr("id", `targetRule${order}`);

  attributeListData.map((v, i) => {
    if (v.contract == targetContractAddress) {
      selectPart.append(
        $("<option>")
          .append(`${v.name} (${v.symbol})`)
          .attr("value", v.contract)
          .attr("selected", "selected")
      );
    } else {
      selectPart.append(
        $("<option>")
          .attr("value", `${v.contract}`)
          .append(`${v.name} (${v.symbol})`)
      );
    }
  });

  return selectPart;
}

function renderOperatorSelect(targetOperator, order) {
  let wrapper = $("<select>")
    .addClass("custom-select")
    .addClass("rule-operator")
    .attr("id", `targetOperator${order}`);

  if (targetOperator == ">") {
    wrapper.append(`
    <option value="0" selected>MORE THAN ( &gt; )</option>
    <option value="1">LESS THAN ( &lt; )</option>
    <option value="2">EQUAL TO ( = )</option>`);
  } else if (targetOperator == "<") {
    wrapper.append(`
    <option value="0">MORE THAN ( &gt; )</option>
    <option value="1" selected>LESS THAN ( &lt; )</option>
    <option value="2">EQUAL TO ( = )</option>`);
  } else if (targetOperator == "=") {
    wrapper.append(`
    <option value="0">MORE THAN ( &gt; )</option>
    <option value="1">LESS THAN ( &lt; )</option>
    <option value="2" selected>EQUAL TO ( = )</option>`);
  } else {
    wrapper.append(`
    <option value="0">MORE THAN ( &gt; )</option>
    <option value="1">LESS THAN ( &lt; )</option>
    <option value="2">EQUAL TO ( = )</option>`);
  }

  // let optionMore =
  //   targetOperator == ">"
  //     ? $("<option>")
  //         .append("MORE THAN ( &gt;)")
  //         .attr("value", "more")
  //         .attr("selected")
  //     : $("<option>")
  //         .append("MORE THAN ( &gt; )")
  //         .attr("value", "more");

  // wrapper.append(optionMore);

  // let optionLess =
  //   targetOperator == "<"
  //     ? $("<option>")
  //         .append("LESS THAN ( &lt; )")
  //         .attr("value", "less")
  //         .attr("selected")
  //     : $("<option>")
  //         .append("LESS THAN ( &lt; )")
  //         .attr("value", "less");

  // wrapper.append(optionLess);

  // let optionEqual =
  //   targetOperator == "="
  //     ? $("<option>")
  //         .append("EQUAL TO ( = )")
  //         .attr("value", "equal")
  //         .attr("selected")
  //     : $("<option>")
  //         .append("EQUAL TO ( = )")
  //         .attr("value", "equal");

  // wrapper.append(optionEqual);

  return wrapper;
}

function renderOperatorSelectTag(order) {
  let a = $("<div>")
    .addClass("input-group-append")
    .append(
      $("<div>")
        .append("operator")
        .addClass("input-group-text")
        .attr("for", `targetOperator${order}`)
    );

  return a;
}

function renderValueInput(value, order) {
  return `<input type="text" class="form-control rule-value" id="targetValue${order}" value="${value}"
  placeholder="amount" style="max-width: 120px;">
`;
}

function renderValueTag(symbol, order) {
  // return `<div class="input-group-append" for="targetValue${order}">
  //   <span class="input-group-text">${symbol}</span>
  // </div>`;

  return `
  <div class="input-group-append">
    <button class="btn btn-outline-danger" type="button" onclick="removerulebyindex(${order})">Remove</button>
  </div>`;
}

function saveRule() {
  let targets = $(".rule-target");
  let operators = $(".rule-operator");
  let values = $(".rule-value");

  let op = [">", "<", "="];

  let inputArray = [];

  for (let i = 0; i < targets.length; i++) {
    let toCompare = `${targets[i].value}`;

    let tmp = attributeListData.find((v, i) => {
      if (v.contract == toCompare) {
        return v;
      }
    });
    inputArray.push({
      info: { ...tmp },
      target: targets[i].value,
      operator: op[operators[i].value],
      value: values[i].value
    });
  }

  ENDPOINT_RULE[currentEditTargetId] = inputArray;
  window.localStorage.setItem("endpointRules", JSON.stringify(ENDPOINT_RULE));

  renderRuleCard(currentEditTargetId);

  setTimeout(function() {
    $("#ruleEditModal").modal("hide");
  }, 1000);
}

function saveRuleV2() {
  let targets = $(".rule-target");
  let operators = $(".rule-operator");
  let values = $(".rule-value");
  let op = [">", "<", "="];
  let inputArray = [];
  const targetSet = new Set(inputArray);
  for (let i = 0; i < targets.length; i++) {
    if (targetSet.add(targets[i].value).size != i + 1) {
      console.log(`target duplicate: ${targets[i].value}`);
    }
    if (values[i].value < 0) {
      console.log(`value must be a non zero value: ${values[i].value}`);
    }
    let toCompare = `${targets[i].value}`;
    let tmp = attributeListData.find((v, i) => {
      if (v.contract == toCompare) {
        return v;
      }
    });
    inputArray.push({
      info: { ...tmp },
      target: targets[i].value,
      operator: op[operators[i].value],
      value: values[i].value
    });
  }
  ENDPOINT_RULE[currentEditTargetId] = inputArray;
  window.localStorage.setItem("endpointRules", JSON.stringify(ENDPOINT_RULE));
  renderRuleCard(currentEditTargetId);
  setTimeout(function() {
    $("#ruleEditModal").modal("hide");
  }, 1000);
}

// function addRule() {
//   let newRow = $('<div>')
// }

const numberWithCommas = x => {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
