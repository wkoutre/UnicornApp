const pattern = /[^\W]/g;

const str = "Name";
const matches = pattern.test(str);

console.log(`matches?:`, matches);
