const fs = require("fs");
const { ddMmYyyy } = require("./utils");
const { todosTxtFile, doneTxtFile, parseTodos, appendTodo, overwriteTodos } = require("./file.js");

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
        overwriteTodos(filtered);
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
        overwriteTodos(filtered);

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
