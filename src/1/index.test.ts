import { AoCError } from '../error';
import { computeDistances, DayOneError, sortInput } from './index';
import * as E from 'fp-ts/lib/Either';

describe('day 1', () => {
  describe('sortInput', () => {
    it('should sort the input arrays', () => {
      const input = {
        left: [3, 2, 1],
        right: [1, 2, 3],
      };
      const expected = {
        left: [1, 2, 3],
        right: [1, 2, 3],
      };
      expect(sortInput(input)).toEqual(expected);
    });
  });

  describe('computeDistances', () => {
    test.each([
      {
        left: [1, 2, 3],
        right: [3, 6, 9],
        expected: E.right([2, 4, 6]),
      },
      {
        left: [3, 6, 9],
        right: [1, 2, 3],
        expected: E.right([2, 4, 6]),
      },
      {
        left: [1, 2, 3],
        right: [3, 6],
        expected: E.left(
          new DayOneError('Input arrays are not the same length'),
        ),
      },
    ])('should compute the distances between the two arrays', params => {
      expect(
        computeDistances({
          left: params.left,
          right: params.right,
        }),
      ).toEqual(params.expected);
    });
  });
});
