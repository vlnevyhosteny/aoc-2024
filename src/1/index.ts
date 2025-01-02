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
  a: number[],
  b: number[],
): E.Either<DayOneError, number[]> => {
  const distances: number[] = [];
  for (let i = 0; i < a.length; i++) {
    if (b.length <= i) {
      return E.left(new DayOneError('Input arrays are not the same length'));
    }

    distances.push(Math.abs(b[i] - a[i]));
  }
  return E.right(distances);
};

export const computeSimilarities = (a: number[], b: number[]): number[] => {
  const count = _.countBy(b);

  return a.map(value => (count[value] ? count[value] * value : 0));
};

export const dayOne = (
  filePath: string = './input.csv',
  delimiter: string = '   ',
): TE.TaskEither<
  DayOneError | ReadFileError,
  { partOne: number; partTwo: number }
> =>
  pipe(
    readInputFile(filePath, delimiter),
    TE.chain(input => {
      const partOne = pipe(
        E.of({
          left: _.orderBy(input.left),
          right: _.orderBy(input.right),
        }),
        E.chain(input => computeDistances(input.left, input.right)),
        E.map(_.sum),
      );

      if (E.isLeft(partOne)) {
        return TE.left(partOne.left);
      }

      return TE.right({
        partOne: partOne.right,
        partTwo: pipe(computeSimilarities(input.left, input.right), _.sum),
      });
    }),
  );

// ,
