const { spawn } = require("child_process");

let expectStdoutToBe = ({ cli, expected, done }) => {
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
      // a trailing newline is necessary after
      // expected for the match to succeed
      expect(received).toBe(`${expected}\n`);
      done();
    }
  });

  process.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    done(data.toString("utf8"));
  });

  process.on("error", (error) => {
    done(error.message);
  });
};

module.exports = {
  expectStdoutToBe: expectStdoutToBe,
};
