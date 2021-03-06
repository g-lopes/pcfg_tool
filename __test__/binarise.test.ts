import {
  // addParents,
  // getAncestorsLabels,
  isPreterminal,
  // markovize,
  getSubTreeByPosition,
  getChildrenLabels,
  // getOriginalLabel,
  createSExpression,
  getChildren,
  getLabel,
  setLabel,
} from '../src/commands/binarise'
import {SExpression} from '../src/utils'

test('basic', () => {
  expect(0).toBe(0)
})

test('isPreterminal', () => {
  const tree: SExpression = ['NP', 'John']
  const result: boolean = isPreterminal(tree)
  expect(result).toBe(true)
})

test('isPreterminal', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const result: boolean = isPreterminal(tree)
  expect(result).toBe(false)
})

test('getSubTreeByPosition', () => {
  const tree: SExpression = ['NP', 'John']
  const position = [0]
  const subTree: SExpression = getSubTreeByPosition(tree, position)
  const expectedSubTree = ['NP', 'John']
  expect(subTree).toEqual(expectedSubTree)
})

test('getSubTreeByPosition', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const position = [0, 2, 1]
  const subTree: SExpression = getSubTreeByPosition(tree, position)
  const expectedSubTree: SExpression = ['NP-TMP', ['DT', 'this'], ['NN', 'year']]
  expect(subTree).toEqual(expectedSubTree)
})

test('getSubTreeByPosition', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const position = [1, 1, 1]
  const subTree: SExpression = getSubTreeByPosition(tree, position)
  const expectedSubTree: SExpression = 'Not'
  expect(subTree).toEqual(expectedSubTree)
})

test('getSubTreeByPosition', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const position = [1, 2, 2, 1]
  const subTree: SExpression = getSubTreeByPosition(tree, position)
  const expectedSubTree: SExpression = 'year'
  expect(subTree).toEqual(expectedSubTree)
})

test('getSubTreeByPosition', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const position = [0, 1, 2, 1]
  const subTree: SExpression = getSubTreeByPosition(tree, position)
  const expectedSubTree: SExpression = ['DT', 'this']
  expect(subTree).toEqual(expectedSubTree)
})

test('getChildrenLabels only one (nonterminal) child', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const childrenLabels = getChildrenLabels(tree)
  const expectedChildrenLabels: string[] = ['FRAG']
  expect(childrenLabels).toEqual(expectedChildrenLabels)
})

test('getChildrenLabels three (nonterminal) children', () => {
  const tree: SExpression = [
    'FRAG',
    ['RB', 'Not'],
    ['NP-TMP',
      ['DT', 'this'],
      ['NN', 'year']],
    ['.', '.'],
  ]
  const childrenLabels = getChildrenLabels(tree)
  const expectedChildrenLabels: string[] = ['RB', 'NP-TMP', '.']
  expect(childrenLabels).toEqual(expectedChildrenLabels)
})

test('getChildrenLabels only one (terminal) child', () => {
  const tree: SExpression = ['RB', 'Not']
  const childrenLabels = getChildrenLabels(tree)
  const expectedChildrenLabels: string[] = ['Not']
  expect(childrenLabels).toEqual(expectedChildrenLabels)
})

test('createSExpression', () => {
  const label = 'ROOT'
  const originalTree: SExpression = ['FRAG^<ROOT>',
    ['RB', 'Not'],
    ['FRAG|<NP-TMP,.>^<ROOT>',
      ['NP-TMP^<FRAG,ROOT>',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const expectedTree: SExpression = [
    'ROOT',
    ['FRAG^<ROOT>',
      ['RB', 'Not'],
      ['FRAG|<NP-TMP,.>^<ROOT>',
        ['NP-TMP^<FRAG,ROOT>',
          ['DT', 'this'],
          ['NN', 'year']],
        ['.', '.']]],
  ]
  const newTree: SExpression = createSExpression(originalTree, label)
  console.log(newTree)
  expect(newTree).toEqual(expectedTree)
})

test('getChildren of a tree with only one (nonterminal) child', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const children = getChildren(tree)
  const expectedChildren: SExpression = [['FRAG',
    ['RB', 'Not'],
    ['NP-TMP',
      ['DT', 'this'],
      ['NN', 'year']],
    ['.', '.']]]
  expect(children).toEqual(expectedChildren)
})

test('getChildren three (nonterminal) children', () => {
  const tree: SExpression = [
    'FRAG',
    ['RB', 'Not'],
    ['NP-TMP',
      ['DT', 'this'],
      ['NN', 'year']],
    ['.', '.'],
  ]
  const children = getChildren(tree)
  const expectedChildren: SExpression = [
    ['RB', 'Not'],
    ['NP-TMP',
      ['DT', 'this'],
      ['NN', 'year']],
    ['.', '.'],
  ]
  expect(children).toEqual(expectedChildren)
})

test('getChildren only one (terminal) child', () => {
  const tree: SExpression = ['RB', 'Not']
  const children = getChildren(tree)
  const expectedChildren: SExpression = ['Not']
  expect(children).toEqual(expectedChildren)
})

test('getLabel', () => {
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const label = getLabel(tree)
  const expectedLabel = 'ROOT'
  expect(label).toBe(expectedLabel)
})

test('getLabel of preTerminal', () => {
  const tree: SExpression = ['NP', 'John']
  const label = getLabel(tree)
  const expectedLabel = 'NP'
  expect(label).toBe(expectedLabel)
})

test('getLabel of tree made out of only one node', () => {
  const tree: SExpression = 'John'
  const label = getLabel(tree)
  const expectedLabel = 'John'
  expect(label).toBe(expectedLabel)
})

test('setLabel', () => {
  const newLabel = 'galloooooo'
  const tree: SExpression = ['ROOT',
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  const expectedTree: SExpression = [newLabel,
    ['FRAG',
      ['RB', 'Not'],
      ['NP-TMP',
        ['DT', 'this'],
        ['NN', 'year']],
      ['.', '.']]]
  setLabel(tree, newLabel)
  expect(tree).toEqual(expectedTree)
})

// test('getOriginalLabel', () => {
//   const originalTree: SExpression = ['ROOT',
//     ['FRAG',
//       ['RB', 'Not'],
//       ['NP-TMP',
//         ['DT', 'this'],
//         ['NN', 'year']],
//       ['.', '.']]]
//   const modifiedTree: SExpression = ['ROOT',
//     ['FRAG^<ROOT>',
//       ['RB', 'Not'],
//       ['FRAG|<NP-TMP,.>',
//         ['NP-TMP',
//           ['DT', 'this'],
//           ['NN', 'year']],
//         ['.', '.']]]]
//   const originalLabel = getOriginalLabel(originalTree)
//   expect(originalLabel).not.toBe('FRAG^<ROOT>')
//   expect(originalLabel).toBe('FRAG')
// })

// test('getAncestorsLabels', () => {
//   const originalTree: any = ['ROOT',
//     ['FRAG',
//       ['RB', 'Not'],
//       ['NP-TMP',
//         ['DT', 'this'],
//         ['NN', 'year']],
//       ['.', '.']]]
//   const label = 'FRAG'
//   const expectedNewLabel = 'FRAG^<ROOT>'
//   const ancestorsLabel = getAncestorsLabels(originalTree, 1)

//   expect(ancestorsLabel).toBe(expectedNewLabel)
// })

// test('markovize tree that is preterminal', () => {
//   const tree: SExpression = ['NP', 'John']
//   const binerizedTree: SExpression = markovize(tree, 1, 999)
//   expect(binerizedTree).toBe(tree)
// })

// test('markovize tree that has only 2 children', () => {
//   const tree: SExpression = [
//     'S',
//     ['NP',
//       ['DT', 'the'],
//       ['NN', 'man']],
//     ['VP',
//       ['Vt', 'saw'],
//       ['NP',
//         ['DT', 'the'],
//         ['NN', 'dog']]],
//   ]
//   const binerizedTree: SExpression = markovize(tree, 1, 999)
//   expect(binerizedTree).toBe(tree)
// })

// test('markovize tree with v = 3 and h = 999', () => {
//   const v = 3
//   const h = 999
//   const originalTree: SExpression = ['ROOT',
//     ['FRAG',
//       ['RB', 'Not'],
//       ['NP-TMP',
//         ['DT', 'this'],
//         ['NN', 'year']],
//       ['.', '.']]]
//   const expectedBinarizedTree: SExpression = [
//     'ROOT',
//     ['FRAG^<ROOT>',
//       ['RB', 'Not'],
//       ['FRAG|<NP-TMP,.>^<ROOT>',
//         ['NP-TMP^<FRAG,ROOT>',
//           ['DT', 'this'],
//           ['NN', 'year']],
//         ['.', '.']]],
//   ]
//   const binerizedTree: SExpression = markovize(originalTree, v, h)
//   expect(binerizedTree).toBe(expectedBinarizedTree)
// })

