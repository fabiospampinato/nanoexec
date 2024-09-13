# Nano Exec

A tiny wrapper around "spawn" for executing a command efficiently and conveniently.

It supports all options that `child_process.spawn` itself supports.

## Install

```sh
npm install --save nanoexec
```

## Usage

```ts
import exec from 'nanoexec';

// Execute a command successfully, directly

const result = await exec ( 'echo', ['example'] );

result.process; // => ChildProcess
result.ok; // => true, because the exit code is 0
result.code; // => 0
result.stderr; // => <Buffer >
result.stdout; // => <Buffer 65 78 61 6d 70 6c 65 0a>
result.stdout.toString (); // => 'example\n'

// Execute a command successfully, going through the shell

const result = await exec ( 'echo "example"', { shell: true } );

result.process; // => ChildProcess
result.ok; // => true, because the exit code is 0
result.code; // => 0
result.stderr; // => <Buffer >
result.stdout; // => <Buffer 65 78 61 6d 70 6c 65 0a>
result.stdout.toString (); // => 'example\n'

// Execute a command successfully, but with a non-zero exit code

const result = await exec ( 'node', ['-e', 'process.exit(2)'] );

result.process; // => ChildProcess
result.ok; // => false, because the exit code is not 0
result.code; // => 2
result.stderr; // => <Buffer >
result.stdout; // => <Buffer >

// Execute a command that throws

await exec ( 'unknowncmd' ); // => throws: Error ( 'spawn unknowncmd ENOENT' )

// Execute a command, read the subprocess immediately, and await the rest

const result = exec ( 'echo', ['example'] );

result.process; // => ChildProcess
await result.ok; // => true, because the exit code is 0
await result.code; // => 0
await result.stderr; // => <Buffer >
await result.stdout; // => <Buffer 65 78 61 6d 70 6c 65 0a>
```

## License

MIT © Fabio Spampinato
