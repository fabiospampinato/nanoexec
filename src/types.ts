
/* IMPORT */

import type {ChildProcess} from 'node:child_process';

/* MAIN */

type Result = {
  process: ChildProcess,
  ok: boolean,
  code: number | null,
  stderr: Buffer,
  stdout: Buffer
};

type ResultPromise = PromiseLike<Result> & {
  process: ChildProcess,
  ok: Promise<boolean>,
  code: Promise<number | null>,
  stderr: Promise<Buffer>,
  stdout: Promise<Buffer>
};

/* EXPORT */

export type {Result, ResultPromise};
