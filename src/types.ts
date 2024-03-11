
/* MAIN */

type Result = {
  ok: boolean,
  code: number | null,
  stderr: Buffer,
  stdout: Buffer
};

/* EXPORT */

export type {Result};
