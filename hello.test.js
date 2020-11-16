const { spawn } = require("child_process");

let testStdout = ({ cli, expected, done }) => {
  // cli : array[2]
  // array[0] : name of the process
  // array[1] : arrays of arguments to the process
  //
  // Example:
  // let cli = [node, [`${__dirname}/hello.js`]]

  const process = spawn(...cli);

  // accumulator for streaming data
  let received = "";
  process.stdout.on("data", (data) => {
    received = received + data.toString("utf8");
  });

  // when finished receiving streaming data
  // match received against expected
  process.on("close", (code) => {
    if (code !== 0) {
      done(`process exited with code ${code}`);
    } else {
      expect(received).toBe(expected);
      done();
    }
  });

  process.stderr.on("data", (data) => {
    done(data);
  });

  process.on("error", (error) => {
    done(error.message);
  });
};

test("foobar", (done) => {
  testStdout({
    cli: [`node`, [`${__dirname}/hello.js`]],
    expected: "Hello world!\n",
    done: done,
  });
});
