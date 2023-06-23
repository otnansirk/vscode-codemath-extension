import assert from 'assert';
import calculate from './calculate';

describe('Calculate', () => {

  const TEST_CASES = [
    {
      input: '1+1',
      expected: 2,
    },
    {
      input: '10*2',
      expected: 20,
    },
    {
      input: 'sin(0)',
      expected: 0,
    },
    {
      input: '1+2',
      expected: 3,
    },
    {
      input: '1+1*3-(5+1)',
      expected: -2
    },
    {
      input: 'sqrt(12)',
      expected: 3.4641016151377544
    },
    {
      input: '2^2',
      expected: 4
    },
    {
      input: 'pi',
      expected: 3.141592653589793
    },
    {
      input: 'max(3,7)',
      expected: 7
    },
    {
      input: 'min(3,7,2)',
      expected: 2
    },
    {
      input: 'log(24)',
      expected: 1.380211241711606
    },
    {
      input: '1+(24+2)*2',
      expected: 53
    }
  ];

  TEST_CASES.forEach(item => {
    it(`Sould ${item.input} equal to ${item.expected}`, () => {
      assert.strictEqual(calculate(item.input), item.expected);
    });
  });
});