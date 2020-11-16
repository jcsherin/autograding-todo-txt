const { expectStdoutToBe } = require("./cliTestHelper");

test("foobar", (done) => {
  expectStdoutToBe({
    cli: [`node`, [`${__dirname}/hello.js`]],
    expected: "Hello world!",
    done: done,
  });
});
