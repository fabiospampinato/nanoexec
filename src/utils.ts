
/* IMPORT */

import {Buffer} from 'node:buffer';

/* MAIN */

const assertBuffer = ( value: unknown ): value is Buffer => {

  if ( Buffer.isBuffer ( value ) ) {

    return true;

  } else {

    throw new Error ( `Expected a Buffer, got ${value}` );

  }

};

/* EXPORT */

export {assertBuffer};
