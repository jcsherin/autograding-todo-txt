const fs = require("fs");
const path = require("path");
const { EOL } = require("os");

let touchFileAnd = (path, callback) => {
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

  touchFileAnd(todosTxtFile, () => {
    contents = fs.readFileSync(todosTxtFile, "utf8");
  });

  let todos = contents === "" ? [] : contents.split(EOL);
  todos.pop(); // remove last trailing newline which is not a todo

  return todos;
};

let appendTodo = (path, todo) => {
  let contents = `${todo}${EOL}`;

  touchFileAnd(path, () => {
    fs.appendFileSync(path, contents, "utf8");
  });
};

let overwriteTodos = (todos) => {
  let contents = todos.map((todo) => `${todo}${EOL}`).join("");

  touchFileAnd(todosTxtFile, () => {
    fs.writeFileSync(todosTxtFile, contents, "utf8");
  });
};

module.exports = {
  todosTxtFile,
  doneTxtFile,
  parseTodos,
  appendTodo,
  overwriteTodos,
};
