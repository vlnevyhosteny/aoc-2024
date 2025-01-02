import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { readCSVFile, ReadFileError } from '../io';
import { AoCError } from '../error';
import _ from 'lodash';

type Input = {
  left: number[];
  right: number[];
};

export class DayOneError extends AoCError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'DayOneError';
  }
}

const readInputFile = (
  filePath: string = './input.csv',
  delimiter: string = '   ',
): TE.TaskEither<ReadFileError, Input> =>
  pipe(
    readCSVFile(filePath, delimiter),
    TE.fold(
      err => TE.left(err),
      data => {
        const left: number[] = [];
        const right: number[] = [];

        for (const row of data) {
          const leftValue = parseInt(row[0], 10);
          const rightValue = parseInt(row[1], 10);

          if (isNaN(leftValue)) {
            return TE.left(
              new DayOneError(`Invalid left number [${row[0]}] in input file`),
            );
          }
          if (isNaN(rightValue)) {
            return TE.left(
              new DayOneError(`Invalid right number [${row[1]}] in input file`),
            );
          }

          left.push(leftValue);
          right.push(rightValue);
        }

        return TE.right({ left, right });
      },
    ),
  );

export const sortInput = (input: Input): Input => {
  input.left.sort((a, b) => a - b);
  input.right.sort((a, b) => a - b);
  return input;
};

export const computeDistances = (
  input: Input,
): E.Either<DayOneError, number[]> => {
  const distances: number[] = [];
  for (let i = 0; i < input.left.length; i++) {
    if (input.right.length <= i) {
      return E.left(new DayOneError('Input arrays are not the same length'));
    }

    distances.push(Math.abs(input.right[i] - input.left[i]));
  }
  return E.right(distances);
};

export const dayOne = (
  filePath: string = './input.csv',
  delimiter: string = '   ',
): TE.TaskEither<DayOneError | ReadFileError, number> =>
  pipe(
    readInputFile(filePath, delimiter),
    TE.map(sortInput),
    TE.chain(input => TE.fromEither(computeDistances(input))),
    TE.map(_.sum),
  );
