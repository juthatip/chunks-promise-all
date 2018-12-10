const fetch = require("node-fetch");
let url = `http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=2&q=`;

let q1 = `${url}cat`;

let query = [
  "cat",
  "rainbow",
  "dog",
  "heart",
  "love",
  "animations",
  "cartoon",
  "bear",
  "fish",
  "underwater",
  "party",
  "sport",
  "run",
  "runway",
  "smile"
];

const chunks = query => {
  const chunked = [];
  for (let i = 0; i < query.length; i++) {
    chunked.push(query.splice(0, 5));
  }
  return chunked;
};

const chunkData = chunks(query);

console.log("1.chunked", chunkData);

const fetchDataPromise = name => {
  console.log("3.fetchDataPromise", name);
  return Promise.all(
    name.map(arrData => fetch(`${url}${arrData}`).then(resp => resp.json()))
  ).then(resData => {
    return resData;
  });
};

const requestToExternalService = function(d, i) {
  // Replace with a promise that does real work here...
  return new Promise(resolve => {
    console.log(`${i}: ===1`, d);
    fetch(`${url}${d}`)
      .then(resp => resp.json())
      .then(resData => {
        // console.log(`${i}: ===2`, resData);
        // setTimeout(resolve, 250);
        return resolve(d);
      });
    // Delay demonstrates we are indeed batching
  });
};

const reducer = (chain, batch) =>
  chain.then(() =>
    Promise.all(batch.map(async (d, i) => requestToExternalService(d, i)))
  );

const promiseChain = chunkData.reduce(reducer, Promise.resolve());
