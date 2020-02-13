import axios from "axios";

const args = process.argv;

async function main() {
  const { data } = await axios.post("http://localhost:30000", { args });
  console.log(data);
}

main();
