const { spawn } = require("child_process");

let testCli = (cli, expected, done) => {
  const process = spawn(...cli);

  let received = "";
  process.stdout.on("data", (data) => {
    received = received + data.toString("utf8");
  });

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

// format in which `spawn` function expects arguments
let argsForCli = [`node`, [`${__dirname}/hello.js`]];

test("foobar", (done) => {
  let expected = "Hello world!\n";
  testCli(argsForCli, expected, done);
});
