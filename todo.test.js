const { expectStdoutToBe } = require("./cliTestHelper");
const fs = require("fs");

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

test("add multiple todos", (done) => {
  let cli = (todo) => ["node", [`${__dirname}/todo.js`, "add", todo]];

  let todos = ["the thing i need to do", "another todo", "last thing i need to take care of"];

  let expected = [
    `1. the thing i need to do`,
    `1. the thing i need to do
2. another todo`,
    `1. the thing i need to do
2. another todo
3. last thing i need to take care of`,
  ];

  todos.forEach((t, i) => expectStdoutToBe({ cli: cli(t), expected: expected[i], done }));
});
