import {induce} from '../src/grammar-inducer'

test('adds 1 + 2 to equal 3', () => {
  const x = induce()
  expect(x).toBe('lol')
})
