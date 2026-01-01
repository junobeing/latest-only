import { latest } from "./latest.js";

const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const search = latest(async (query: string) => {
  await wait(query === "jo" ? 300 : 100);
  return query;
});

async function run() {
  const a = search("jo");
  const b = search("john");

  console.log(await a); // undefined
  console.log(await b); // john
}

run();
