import assert from 'assert';
import { cleanExpression } from './cleanExpression';

describe('Clean expression ', () => {

  const TEST_CASES = [
    {
      input: ' 1+1',
      expected: '1+1',
    },
    {
      input: '10*2 ',
      expected: '10*2',
    },
    {
      input: ' 10-2 ',
      expected: '10-2',
    },
    {
      input: '* 10-2 ',
      expected: ' 10-2',
    },
    {
      input: '// 10-2 ',
      expected: ' 10-2',
    },
    {
      input: '# 10-2 ',
      expected: ' 10-2',
    },
    {
      input: '#10-2 ',
      expected: '10-2',
    },
  ];

  TEST_CASES.forEach(item => {
      it(`Sould ${item.input} equal to ${item.expected}`, () => {
        assert.strictEqual(cleanExpression(item.input), item.expected);
      });
  });
});