
/* IMPORT */

import {spawn} from 'node:child_process';
import makeNakedPromise from 'promise-make-naked';
import {assertBuffer} from './utils';
import type {SpawnOptions} from 'node:child_process';
import type {Result, ResultPromise} from './types';

/* MAIN */

//TODO: Automatically detect if "shell" should be set to true, maybe, somehow

function exec ( command: string, options?: SpawnOptions ): ResultPromise;
function exec ( command: string, args?: string[], options?: SpawnOptions ): ResultPromise;
function exec ( command: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions ): ResultPromise {

  const {promise, resolve, reject} = makeNakedPromise<Result>();

  const processArgs = Array.isArray ( argsOrOptions ) ? argsOrOptions : [];
  const processOptions = Array.isArray ( argsOrOptions ) ? options : argsOrOptions;
  const processDefaultOptions: SpawnOptions = { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] };
  const process = spawn ( command, processArgs, { ...processDefaultOptions, ...processOptions } );

  const stderrChunks: Buffer[] = [];
  const stdoutChunks: Buffer[] = [];

  process.stderr?.on ( 'data', ( chunk: Buffer ) => {
    assertBuffer ( chunk );
    stderrChunks.push ( chunk );
  });

  process.stdout?.on ( 'data', ( chunk: Buffer ) => {
    assertBuffer ( chunk );
    stdoutChunks.push ( chunk );
  });

  process.on ( 'error', ( error: Error ) => {
    reject ( error );
  });

  process.on ( 'exit', ( code: number | null ) => {
    const ok = ( code === 0 );
    const stderr = Buffer.concat ( stderrChunks );
    const stdout = Buffer.concat ( stdoutChunks );
    const result: Result = { process, ok, code, stderr, stdout };
    resolve ( result );
  });

  return {
    then: promise.then.bind ( promise ),
    process,
    get ok () {
      return promise.then ( result => result.ok );
    },
    get code () {
      return promise.then ( result => result.code );
    },
    get stderr () {
      return promise.then ( result => result.stderr );
    },
    get stdout () {
      return promise.then ( result => result.stdout );
    }
  };

}

/* EXPORT */

export default exec;
export type {Result, ResultPromise};
