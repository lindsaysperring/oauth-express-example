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
        code_verifier: `G.IUFqIfrF3GXvwJeYO2ABv5H_5weB~-oJoBS5wWCC6WzvC3JQgzn80fYFEmw2u1EBt5qF5fgzgkgPnd6JSZIjdwe_VXzRW61YUyAWHSFTlEUgMbp91bHUH.6kw7OyvW`,
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
    }&state=1234&scope=${encodeURIComponent(
      config.scope
    )}&redirect_uri=${encodeURIComponent(
      config.callbackURI
    )}&code_challenge=DrlJGI2ei9yAmJNUZiC1MbR3__uZ_FhLB3uBAbGN8xM&code_challenge_method=S256&aud=https://vteapif1.aetna.com/fhirdemo/v1/patientaccess&skin=skin13&branding=aetnamedicaid&language=en`
  );
});
