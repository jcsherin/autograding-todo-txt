const fs = require("fs");
const { execSync, exec } = require("child_process");

let deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (err) {}
};

beforeEach(() => deleteFile(`${__dirname}/todo.txt`));

let todoTxtCli = (...args) => ["node", `${__dirname}/todo.js`, ...args].join(" ");

let usage = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage
`;

test("prints help when no additional args are provided", () => {
  let cli = ["node", [`${__dirname}/todo.js`]];

  let received = execSync(todoTxtCli()).toString("utf8");
  expect(received).toBe(usage);
});

test("prints help", () => {
  let cli = ["node", [`${__dirname}/todo.js`, "help"]];

  let received = execSync(todoTxtCli("help")).toString("utf8");
  expect(received).toBe(usage);
});

test("add a single todo", () => {
  let cli = ["node", [`${__dirname}/todo.js`, "add", "the thing i need to do"]];

  let expected = `Added todo: "the thing i need to do"\n`;

  let received = execSync(todoTxtCli("add", '"the thing i need to do"')).toString("utf8");
  expect(received).toBe(expected);
});

test("add multiple todos", () => {
  let todos = ["the thing i need to do", "water the plants", "find needle in the haystack"];

  todos.forEach((todo, i) => {
    let expected = `Added todo: "${todo}"\n`;
    let received = execSync(todoTxtCli("add", `"${todo}"`)).toString("utf8");
    expect(received).toBe(expected);
  });
});

test("list remaining todos", () => {
  let todos = ["the thing i need to do", "water the plants", "find needle in the haystack"];

  todos.forEach((todo) => execSync(todoTxtCli("add", `"${todo}"`)));

  let expected = `[1] the thing i need to do
[2] water the plants
[3] find needle in the haystack
`;

  let received = execSync(todoTxtCli("ls")).toString("utf8");
  expect(received).toBe(expected);
});
