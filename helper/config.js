/*
Project : NFT-marketplace
FileName :  config.js
*/
const config = {
  app: {
    port: 5000,
  },
  db: {
    host: "cluster0.ni99lik.mongodb.net",
    port: 27017,
    username: "admin",
    password: "123",
    name: "nftmarketplacetest",
    prefix: "linkwell_",
  },
  mail: {
    type: "",
    smtp: {
      host: "smtp.sendgrid.net",
      secure: false,
      port: 587,
      username: "",
      password: "",
    },
  },
  site_name: "Cryptotrades",
  site_link: "#",
  site_email: "",
  secret_key: "jfVRtwN7xBl7LjRucIUdPnrh1UVUhzhZ",
  public_key: "6gluXXunc77uukLJbSmlQ31ckSlLq8Qi",
  eth_http: "https://rinkeby.infura.io/v3/64fa77a39b9a4c31b186fb2148edff70",

  cloud_name: "shreewallet",
  api_key: "253594261126844",
  api_secret: "u3Q5RXtzyCxxxpHWzCoMnwmdHRs",

  profile_cover:
    "https://res.cloudinary.com/shreewallet/image/upload/v1645101317/artoperatesting/user/cover/subheader_k4bchy.jpg",
  profile_image:
    "https://res.cloudinary.com/shreewallet/image/upload/v1645171791/artoperatesting/user/profile/profile_whg3qb.png",
};

module.exports = config;
