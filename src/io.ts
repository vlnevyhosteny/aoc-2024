import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import fs from 'fs/promises';
import { parse } from 'csv-parse';
import { AoCError } from './error';

export class ReadFileError extends AoCError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'ReadFileError';
  }
}

export const readCSVFile = (
  filePath: string,
  delimiter: string,
): TE.TaskEither<ReadFileError, string[][]> =>
  pipe(
    TE.tryCatch(
      () => fs.readFile(filePath, 'utf8'),
      err => new ReadFileError('Unable to read file', err),
    ),
    TE.chain(data =>
      TE.tryCatch(
        () =>
          new Promise<string[][]>((resolve, reject) => {
            parse(data, { delimiter }, (err, output) => {
              if (err) {
                reject(err);
              } else {
                resolve(output);
              }
            });
          }),
        err => new ReadFileError('Unable to parse CSV', err),
      ),
    ),
  );
