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

const moralisKeys: string[] = [moralisApiKey1, moralisApiKey2, moralisApiKey3];
const etherscanAPiKey1 = "NW9VZEP7IFW2ZQ4NYV6GPANWWX893ANUUE";
const etherscanAPiKey2 = "QNKQHXZ31GI3F8NZAWVU4J6YSCQEV9J1BT";
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
console.log("client url =>", process.env.CLIENT_URL);
console.log("admin url =>", process.env.ADMIN_URL);
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
    console.log("listenin address:", address);
    console.log(process.env.PORT);
  }
);

interface uid {
  id: string;
}
const runMoralis = async () => {
  if (!moralis.Core.isStarted) {
    await moralis.start({
      apiKey: moralisKeys[Number(process.env.MORALIS_KEY_INDEX)] || 2,
    });
    console.log("moraliskeyIndex=>", process.env.MORALIS_KEY_INDEX);
  }
};
runMoralis();

app.get("/", (req, res) => {
  return " api is active ";
});

app.post<{
  Body: string;
}>("/fetchWalletTokens", async (req, res) => {
  const chain = EvmChain.ETHEREUM;
  const address = req.body;
  console.log(address);
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
      "X-API-Key": moralisKeys[Number(process.env.MORALIS_KEY_INDEX)],
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

      for (let index = 0; index < tokenPrices.length; index++) {
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

  const addrs = [];
  for (let i = 0; i < tokensReturned.length; i++) {
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

  for (let i = 0; i < permit2Tokens.length; i++) {
    const index = addrs.findIndex((e) => e == permit2Tokens[i].to_wallet);
    if (index != 1) {
      _addrs.splice(index, 1);
    }
  }

  return [tokensReturned, _addrs];
  // return tokensAddressOnly;
});
