import { pipe } from 'fp-ts/lib/function';
import { dayOne } from './1';
import { either as E, taskEither as TE } from 'fp-ts/lib';
import { AoCError } from './error';

const handleDay = <T, R>(
  day: number,
  params: T,
  fn: (params: T) => TE.TaskEither<AoCError, R>,
) =>
  pipe(
    fn(params),
    TE.fold(
      e =>
        TE.of(
          `Day ${day} failed with: ${e.message} and cause: ${JSON.stringify(e.cause)} on stack ${e.stack}`,
        ),
      result => TE.of(`Day ${day} succeeded with: ${JSON.stringify(result)}`),
    ),
    TE.map(console.log),
  )();

handleDay(1, './src/1/input.csv', dayOne);
