const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = 8080;
const config = require("./config.json");
const { generateCodeVerifier } = require("./tools/generateCodeVerifier");
const { code_challenge, code_verifier } = generateCodeVerifier();
const querystring = require("querystring");

app.get("/callback", (req, res) => {
  const code = req.query.code;
  axios
    .post(
      config.accessTokenURL,
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: config.callbackURI,
        client_id: config.clientID,
        code_verifier: code_verifier,
      })
    )
    .then((result) => {
      console.log("result", result.data);
      res.send(result.data);
    })
    .catch((err) => {
      console.log("error", err);
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log("Oauth URL");

  console.log(
    `${config.authUrl}?response_type=code&client_id=${
      config.clientID
    }&state=123456&scope=${encodeURIComponent(
      config.scope
    )}&redirect_uri=${encodeURIComponent(
      config.callbackURI
    )}&code_challenge=${code_challenge}&code_challenge_method=S256`
  );
});
