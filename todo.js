const fs = require("fs");
const path = require("path");
const { EOL } = require("os");

let parseTodos = (path) => {
  let fd, contents;
  try {
    fd = fs.openSync(path, "a");
    contents = fs.readFileSync(path, "utf8");
  } catch (err) {
    console.log("Error: getTodos failed");
    console.log(err);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }

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

let todosTxtFile = path.resolve(__dirname, "todo.txt");

let usage = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage`;

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
    let todos = parseTodos(todosTxtFile);

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
      let todos = parseTodos(todosTxtFile);

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
  default:
    console.log(`${action} is not implemented`);
}

/**
 * TODO
 * - move completed todos from todo.txt to done.txt (append)
 * - show completed todos in reverse order (recently completed first)
 * - report / summarize
 * - add tests for everything
 * - refactor: cli, model, tests
 */
