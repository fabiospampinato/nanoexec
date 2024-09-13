
/* IMPORT */

import {describe} from 'fava';
import exec from '../dist/index.js';

/* MAIN */

describe ( 'Nanoexec', it => {

  it ( 'can run a program successfully, directly', async t => {

    const result = await exec ( 'echo', ['foo123'] );

    t.is ( !!result.process.pid, true );
    t.is ( result.ok, true );
    t.is ( result.code, 0 );
    t.is ( result.stderr.toString (), '' );
    t.is ( result.stdout.toString (), 'foo123\n' );

  });

  it ( 'can run a program successfully, via a shell', async t => {

    const result = await exec ( 'echo "foo123"', { shell: true } );

    t.is ( !!result.process.pid, true );
    t.is ( result.ok, true );
    t.is ( result.code, 0 );
    t.is ( result.stderr.toString (), '' );
    t.is ( result.stdout.toString (), 'foo123\n' );

  });

  it ( 'can run a program unsuccessfully, with an exit code', async t => {

    const result = await exec ( 'node', ['-e', 'process.exit(2)'] );

    t.is ( !!result.process.pid, true );
    t.is ( result.ok, false );
    t.is ( result.code, 2 );
    t.is ( result.stderr.toString (), '' );
    t.is ( result.stdout.toString (), '' );

  });

  it ( 'can run a program unsuccessfully, with no exit code', async t => {

    const result = await exec ( 'sleep', ['10'], { timeout: 100 } );

    t.is ( !!result.process.pid, true );
    t.is ( result.ok, false );
    t.is ( result.code, null );
    t.is ( result.stderr.toString (), '' );
    t.is ( result.stdout.toString (), '' );

  });

  it ( 'can run a program and get results lazily', async t => {

    const lazy = exec ( 'echo', ['foo123'] );

    t.is ( !!lazy.process.pid, true );

    const eager = await lazy;

    t.is ( lazy.process.pid, eager.process.pid );
    t.is ( await lazy.ok, eager.ok );
    t.is ( await lazy.code, eager.code );
    t.is ( await lazy.stderr, eager.stderr );
    t.is ( await lazy.stdout, eager.stdout );

  });

  it ( 'can throw for unknown programs', async t => {

    try {

      await exec ( 'unknowncmd' );

    } catch ( error ) {

      t.is ( error.message, 'spawn unknowncmd ENOENT' );

    }

  });

  it ( 'can throw for a triggered signal', async t => {

    try {

      const controller = new AbortController ();
      const abort = controller.abort.bind ( controller );

      setTimeout ( abort, 100 );

      await exec ( 'sleep', ['10'], { signal: controller.signal } );

    } catch ( error ) {

      t.is ( error.message, 'The operation was aborted' );

    }

  });

});
