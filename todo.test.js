const { expectStdoutToBe } = require("./cliTestHelper");

let cli = [`node`, [`${__dirname}/todo.js`]];

test("help -- prints usage of other available commands", (done) => {
  let expected = `Usage :-
$ node todo.js add "todo item"  # Add a new todo
$ node todo.js ls               # Show remaining todos
$ node todo.js del NUMBER       # Delete a todo
$ node todo.js done NUMBER      # Complete a todo
$ node todo.js help             # Show usage`;

  expectStdoutToBe({ cli, expected, done });
});
