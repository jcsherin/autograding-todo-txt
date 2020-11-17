const fs = require("fs");
const path = require("path");
const { EOL } = require("os");
const { ddMmYyyy } = require("./utils");

let createIfFileNotExist = (path, callback) => {
  let fd;
  try {
    fd = fs.openSync(path, "a");
    callback();
  } catch (err) {
    console.log("Error: getTodos failed");
    console.log(err);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
};

let todosTxtFile = path.resolve(__dirname, "todo.txt");
let doneTxtFile = path.resolve(__dirname, "done.txt");

let parseTodos = () => {
  let contents = "";

  createIfFileNotExist(todosTxtFile, () => {
    contents = fs.readFileSync(todosTxtFile, "utf8");
  });

  let todos = contents === "" ? [] : contents.split(EOL);
  todos.pop(); // remove last trailing newline which is not a todo

  return todos;
};

let appendFile = (path, contents) => {
  let fd;
  try {
    fd = fs.openSync(path, "a");
    fs.appendFileSync(path, contents, "utf8");
  } catch (err) {
    console.log("Error: getTodos failed");
    console.log(err);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
};

let writeFile = (path, contents) => {
  let fd;
  try {
    fd = fs.openSync(path, "a");
    fs.writeFileSync(path, contents, "utf8");
  } catch (err) {
    console.log("Error: getTodos failed");
    console.log(err);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
};

let appendTodo = (path, todo) => appendFile(path, `${todo}${EOL}`);

let overwriteTodos = (path, todos) => {
  let contents = "";
  if (todos.length > 0) {
    contents = todos.join(EOL) + EOL; // add trailing EOL for final todo
  }
  writeFile(path, contents);
};

let usage = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage
$ node todo.js report           # Statistics`;

if (process.argv.length <= 2) {
  console.log(usage);
  process.exit();
}

let [action, ...args] = process.argv.slice(2);
switch (action) {
  case "help":
    console.log(usage);
    break;
  case "add":
    if (args.length > 0) {
      let todo = args[0];
      appendTodo(todosTxtFile, todo);
      console.log(`Added todo: "${todo}"`);
    } else {
      console.log("Error: Missing todo string. Nothing added!");
    }
    break;
  case "ls":
    let formatTodo = (todo, no) => `[${no}] ${todo}`;
    let todos = parseTodos();

    if (todos.length > 0) {
      let result = todos
        .map((todo, i) => formatTodo(todo, i + 1))
        .reverse()
        .join("\n");
      console.log(result);
    }
    break;
  case "del":
    if (args.length > 0) {
      let todoNumber = parseInt(args[0]);
      let todos = parseTodos();

      if (todoNumber > 0 && todoNumber <= todos.length) {
        let filtered = todos.filter((_, i) => todoNumber !== i + 1);
        overwriteTodos(todosTxtFile, filtered);
        console.log(`Deleted todo #${todoNumber}`);
      } else {
        console.log(`Error: todo #${todoNumber} does not exist. Nothing deleted.`);
      }
    } else {
      console.log("Error: Missing NUMBER for deleting todo.");
    }
    break;
  case "done":
    if (args.length > 0) {
      let todoNumber = parseInt(args[0]);
      let todos = parseTodos();

      if (todoNumber > 0 && todoNumber <= todos.length) {
        let filtered = todos.filter((_, i) => todoNumber !== i + 1);
        overwriteTodos(todosTxtFile, filtered);

        let date = ddMmYyyy();
        let done = `x ${date} ${todos[todoNumber - 1]}`;
        appendTodo(doneTxtFile, done);

        console.log(`Marked todo #${todoNumber} as done.`);
      } else {
        console.log(`Error: todo #${todoNumber} does not exist.`);
      }
    } else {
      console.log("Error: Missing NUMBER for marking todo as done.");
    }
    break;
  case "report":
    let date = ddMmYyyy();
    let pendingTodos = parseTodos().length;
    let completedTodos = 0;
    try {
      completedTodos = fs.readFileSync(doneTxtFile, "utf8").split("\n").length - 1; // do not count trailing newline;
    } catch (_err) {
      completedTodos = 0;
    }

    let report = `${date} Pending : ${pendingTodos} Completed : ${completedTodos}`;
    console.log(report);
    break;
  default:
    console.log(`The action "${action}" is not understood. Try "help".`);
}
