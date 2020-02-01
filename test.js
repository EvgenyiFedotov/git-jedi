#!/usr/local/bin/node

const axios = require("axios");

const args = process.argv;

async function main() {
  const { data } = await axios.post("http://localhost:3000", { args });
  console.log(data);
}

main();
