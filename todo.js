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

let saveTodo = (path, todo) => {
  let fd;
  try {
    fd = fs.openSync(path, "a");
    fs.appendFileSync(path, `${todo}${EOL}`, "utf8");
  } catch (err) {
    console.log("Error: getTodos failed");
    console.log(err);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
};

let todosTxtFile = path.resolve(__dirname, "todo.txt");

let usage = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage`;

if (process.argv.length > 2) {
  let [action, ...args] = process.argv.slice(2);
  switch (action) {
    case "help":
      console.log(usage);
      break;
    case "add":
      if (args.length > 0) {
        let todo = args[0];
        saveTodo(todosTxtFile, todo);
        console.log(`Added todo: "${todo}"`);
      } else {
        console.log("Error: Missing todo string. Nothing added!");
      }
      break;
    case "ls":
      let formatTodo = (todo, no) => `[${no}] ${todo}`;
      let result = parseTodos(todosTxtFile)
        .map((todo, i) => formatTodo(todo, i + 1))
        .join("\n");
      console.log(result);
      break;
    case "del":
    case "done":
    default:
      console.log(`${action} is not implemented`);
  }
} else {
  console.log(usage);
}
