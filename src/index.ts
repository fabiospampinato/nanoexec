
/* IMPORT */

import {spawn} from 'node:child_process';
import {assertBuffer} from './utils';
import type {SpawnOptions} from 'node:child_process';
import type {Result} from './types';

/* MAIN */

//TODO: Automatically detect if "shell" should be set to true, maybe, somehow

async function exec ( command: string, options?: SpawnOptions ): Promise<Result>;
async function exec ( command: string, args?: string[], options?: SpawnOptions ): Promise<Result>;
async function exec ( command: string, argsOrOptions?: string[] | SpawnOptions, options?: SpawnOptions ): Promise<Result> {

  return new Promise ( ( resolve, reject ) => {

    const processArgs = Array.isArray ( argsOrOptions ) ? argsOrOptions : [];
    const processOptions = Array.isArray ( argsOrOptions ) ? options : argsOrOptions;
    const process = spawn ( command, processArgs, { windowsHide: true, ...processOptions } );

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
      const result: Result = { ok, code, stderr, stdout };
      resolve ( result );
    });

  });

}

/* EXPORT */

export default exec;
export type {Result};
