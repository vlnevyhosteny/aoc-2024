import { AoCError } from '../error';
import {
  computeDistances,
  computeSimilarities,
  DayOneError,
  sortInput,
} from './index';
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
        a: [1, 2, 3],
        b: [3, 6, 9],
        expected: E.right([2, 4, 6]),
      },
      {
        a: [3, 6, 9],
        b: [1, 2, 3],
        expected: E.right([2, 4, 6]),
      },
      {
        a: [1, 2, 3],
        b: [3, 6],
        expected: E.left(
          new DayOneError('Input arrays are not the same length'),
        ),
      },
    ])('should compute the distances between the two arrays', params => {
      expect(computeDistances(params.a, params.b)).toEqual(params.expected);
    });
  });

  describe('computeSimilarities', () => {
    test.each([
      {
        arrayOne: [1, 2, 3],
        arrayTwo: [1, 1, 2],
        expected: [2, 2, 0],
      },
      {
        arrayOne: [1, 2, 3],
        arrayTwo: [4, 6],
        expected: [0, 0, 0],
      },
      {
        arrayOne: [1, 2, 3],
        arrayTwo: [],
        expected: [0, 0, 0],
      },
    ])('should compute the similarity for the two arrays', params => {
      expect(computeSimilarities(params.arrayOne, params.arrayTwo)).toEqual(
        params.expected,
      );
    });
  });
});
