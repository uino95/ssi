const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  isDevEnv: (process.env.USER != null && process.env.USER == "ataglia001"),
  eid_provider_port: 60005,
  myhealth_port: 60009,
  vcreader_port: 60010,
  callback_endpoint: "http://blockchaincc.ga"
};
