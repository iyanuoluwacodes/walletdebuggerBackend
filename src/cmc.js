// coinmarket cap

// let response = null;

new Promise(async (resolve, reject) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/search/btcusdc",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "2a626d19-ca24-459a-9000-cacc940457fd",
        },
      }
    );
    const dat = await response.json();
    // console.log(dat);
  } catch (err) {
    response = null;
    // error
    console.log(err);
    reject(err);
  }
});
