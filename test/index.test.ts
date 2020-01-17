/* eslint-disable no-undef */
import {
  hello,
} from '../src/index';

test('hello', () => {
  expect(hello('npm')).toBe('Hello npm!');
  expect(hello('world')).toBe('Hello world!');
});
