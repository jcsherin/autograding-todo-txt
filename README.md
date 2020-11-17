# Autograding Example: Node

This example project is written in Node, and tested with Jest.

### The assignment

Implement a todo manager with a command-line interface(CLI). The tests are failing right now. Implement the missing features to make the tests green.

You should implement the following,

1. Add a todo item
2. List pending todo items
3. Delete a todo item
4. Mark a todo item as done
5. Print a short help for using the CLI
6. Report count of pending & completed todos

Add a new todo item to `todo.txt`. Each todo item occupies a single line in `todo.txt`.

```sh
$ node todo.js add "the thing i need to do"
Added todo: "the thing i need to do"

$ node todo.js add "water the plants"
Added todo: "water the plants"
```

The contents of `todo.txt`,

```
the thing i need to do
water the plants
```

When listing todos show the most recently added todos first,

```sh
$ node todo.js ls
[2] water the plants
[1] the thing i need to do
```

When a todo is marked as completed, move it from `todo.txt` to `done.txt`.

The format is: `x dd/mm/yyyy the thing i need to do`. There are 3 values. The character `x`, the current date and the todo item.

```sh
$ node todo.js done 1
Marked todo #1 as done.
```

The contents of `done.txt`,

```
x 17/11/2020 the thing i need to do
```

### Setup command

`npm install`

### Run command

`npm test`
