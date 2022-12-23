import proxy from "express-http-proxy";
import express from "express";

const port = parseInt(process.env.PORT || 5900, 10);

const domain = "";

const app = express();

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Foo", "bar");

  next();
});

app.get("/", (_req, res) => res.send("hi!"));

app.post(
  "/graphql",
  proxy(domain, {
    proxyReqOptDecorator(proxyReqOpts) {
      proxyReqOpts.headers["origin"] = domain;
      proxyReqOpts.headers["referer"] = domain;

      delete proxyReqOpts.headers["sec-fetch-site"];
      delete proxyReqOpts.headers["sec-fetch-mode"];

      return proxyReqOpts;
    },
    userResHeaderDecorator(headers, _, userRes) {
      delete headers["content-security-policy"];
      userRes.removeHeader("content-security-policy");

      return headers;
    },
  })
);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}/`);
});

export default app;
