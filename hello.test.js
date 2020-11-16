const { exec, spawn } = require("child_process");

test("runs `node hello.js`", (done) => {
  const helloCli = spawn(`node`, [`${__dirname}/hello.js`]);

  let received = "";
  let expected = "Hello world!\n";

  helloCli.stdout.on("data", (data) => {
    received = received + data.toString("utf8");
  });

  helloCli.on("close", (code) => {
    if (code !== 0) {
      done(`process exited with code ${code}`);
    } else {
      expect(received).toBe(expected);
      done();
    }
  });

  helloCli.stderr.on("data", (data) => {
    done(data);
  });

  helloCli.on("error", (error) => {
    done(error.message);
  });
});
