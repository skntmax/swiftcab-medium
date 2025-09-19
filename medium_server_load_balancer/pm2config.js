
const dotenv = require("dotenv");
const path = require("path");
module.exports = {
  dev: [
    {
      script: "pm2:server:dev",
      base: "medium-dev-server",
    },
  ],

   prod: [
    {
      script: "pm2:server:prod",
      base: "medium-prod-server",
    },
  ],

   stage: [
    {
      script: "pm2:server:stage",
      base: "medium-stage-server",
    },
  ],

 
};