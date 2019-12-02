const APIENDPOINT = `https://api.staging.fst.network/api`;
const USER_ACCESS_TOKEN = window.localStorage.getItem("user_access_token");

let attrubuteListData = [
  {
    contract: "0x01f397efa26a23f143718418fae5f68320476875",
    name: "Attribute 01",
    symbol: "ATR01",
    totalSupply: "1000",
    description: null,
    standard: "ERC1376",
    age: "1575153710000"
  },
  {
    contract: "0xde95f682f6cfe019929f779564f06e39627686d5",
    name: "Attribute 02",
    symbol: "ATR02",
    totalSupply: "1000",
    description: null,
    standard: "ERC1376",
    age: "1575153725000"
  }
];

$(async function() {
  console.log("ready!");
  await fetchAttributeList();
  renderAttributeTable()
});

function renderAttributeTable() {
  attrubuteListData.map((v, i) => {
    let newRow = $("<tr>");

    var cols = "";

    cols += `<td>${i}</td>`;
    cols += `<td>${v.contract}</td>`;
    cols += `<td>${v.name}</td>`;
    cols += `<td>${v.symbol}</td>`;

    cols +=
      '<td><button type="button" class="btn btn-primary">Transfer</button></td>';

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
  const readyToSign = await fetch(APIENDPOINT, {
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
      return json;
    });
}

async function fetchAttributeList() {
  const query = `{
    me {
      token {
        contract
        vouchers {
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

// const rulestry =  [
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
