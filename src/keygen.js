const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Command } = require('commander');
const Keychain = require('keypear');
const DHT = require('hyperdht');
const { SHELLDIR } = require('./constants.js');

const isModule = require.main !== module;

if (isModule) {
  module.exports.cmd = cmd;
} else {
  const program = new Command();

  program
    .description('Create keys of type ed25519 for use by hypercore-protocol.')
    .option('-f <filename>', 'Filename of the seed key file.')
    .option('-c <comment>', 'Provides a new comment.')
    .action(cmd)
    .parseAsync();
}

async function cmd(fileLocation = '') {
  console.log('Generating key.');

  let keyfile;
  if (fileLocation) {
    keyfile = path.resolve(fileLocation);
  } else {
    keyfile = path.join(SHELLDIR, 'peer');

    const answer = await question('Enter file in which to save the key (' + keyfile + '): ');
    const filename = answer.trim();
    if (filename) {
      keyfile = path.resolve(filename);
    }
  }

  if (fs.existsSync(keyfile)) {
    throw new Error(keyfile + ' already exists.'); // Throw an error if the key file already exists
  }

  const seed = Keychain.seed();
  fs.mkdirSync(path.dirname(keyfile), { recursive: true });
  fs.writeFileSync(keyfile, seed.toString('hex') + '\n', { flag: 'wx', mode: '600' });

  console.log('Your key has been saved in', keyfile);
  console.log('The public key is:');
  console.log(DHT.keyPair(seed).publicKey.toString('hex'));

  return DHT.keyPair(seed).publicKey.toString('hex');
}



function question(query = '') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(query, function (answer) {
      rl.close();
      resolve(answer);
    });
  });
}

function errorAndExit(message) {
  console.error('Error:', message);
  process.exit(1);
}
