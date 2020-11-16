const { runCommand, expectStdoutToBe } = require("./cliTestHelper");
const fs = require("fs");
const { execSync } = require("child_process");

let deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (err) {}
};

beforeEach(() => deleteFile(`${__dirname}/todo.txt`));

test("prints help when no additional args are provided", (done) => {
  let cli = ["node", [`${__dirname}/todo.js`]];

  let expected = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage`;

  expectStdoutToBe({ cli, expected, done });
});

test("prints help", (done) => {
  let cli = ["node", [`${__dirname}/todo.js`, "help"]];

  let expected = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage`;

  expectStdoutToBe({ cli, expected, done });
});

test("add single todo", (done) => {
  let cli = ["node", [`${__dirname}/todo.js`, "add", "the thing i need to do"]];

  let expected = `1. the thing i need to do`;

  expectStdoutToBe({ cli, expected, done });
});

let todoTxtCli = (...args) => ["node", `${__dirname}/todo.js`, ...args].join(" ");

test("add multiple todos", () => {
  let expected = `1. first todo\n`;
  let received = execSync(todoTxtCli("add", '"first todo"')).toString("utf8");
  expect(received).toBe(expected);

  expected = `1. first todo\n2. second todo\n`;
  received = execSync(todoTxtCli("add", '"second todo"')).toString("utf8");
  expect(received).toBe(expected);

  expected = `1. first todo\n2. second todo\n3. third todo\n`;
  received = execSync(todoTxtCli("add", '"third todo"')).toString("utf8");
  expect(received).toBe(expected);
});
