var exec = require('child_process').exec;

var os = require('os');

var func = (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
      console.log(stderr);
      return;
  }
  console.log(stdout);
}

if (os.type() === 'Linux')
  exec("prettier --write --config .prettierrc \"**/*.ts\" ", func);
else if (os.type() === 'Darwin')
  exec("prettier --write --config .prettierrc \"**/*.ts\" ", func);
else if (os.type() === 'Windows_NT')
  exec("prettier --write --config .prettierrc **/*.ts ", func);
else
  exec("prettier --write --config .prettierrc **/*.ts ", func);
