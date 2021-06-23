// TODO: remove all console.logs
import {Command, flags} from '@oclif/command'
import {SExpression} from '../grammar-inducer'

/**
 * @param {SExpression} tree - Tree as nested list of strings
 * @returns {boolean} String with given label and its parents appended in the correct form.
 */
export function isPreterminal(tree: SExpression): boolean {
  return typeof tree[1] === 'string'
}

/**
 * Receives a tree and a list of numbers and returns the subtree corresponding to that position
 * @param {SExpression} tree - Tree as nested list of strings
 * @param {number[]} position - list of indexes
 * @returns {SExpression} Subtree
 */
export function getSubTreeByPosition(tree: SExpression, position: number[]): SExpression {
  let element: SExpression = tree
  let current: number | undefined = position.pop()
  if (isPreterminal(tree) && current === 0) {
    return tree
  }
  while (current) {
    element = element[current]
    current = position.pop()
  }
  return element
}

/**
 * addParents(<label>) should return a string of the form 'label^<l_1,...,l_v-1>'
 * where l_i are the labels of the ancestors of label which occur in the original tree.
 * @param {SExpression} originalTree - Label which we want to modify by appending its parents to it.
 * @param {SExpression} currentTree - Number of vertical layers
 * @param {number} v - Number of vertical layers
 * @returns {string} String with given label and its parents appended in the correct form.
 */
export function addParents(originalTree: SExpression, currentTree: SExpression, v: number): SExpression {
  const isTerminal = typeof currentTree === 'string'
  if (isTerminal) return currentTree
  if ((currentTree as Array<SExpression>).length > 0) {
    const _tree: SExpression = (currentTree as Array<SExpression>).shift()!
    addParents(originalTree, _tree, v - 1)
  }
  return []
  // const hasNoParents = isEqual(originalTree, subTree)
  // const currentLabel: string = (subTree[0] as string)

  // if (v === 1 || hasNoParents) {
  //   return currentLabel
  // }

  // let result: string = `${currentLabel}^<`
  // for (let i = 0; i <= v - 1; i++) {
  //   const nextTree: SExpression = getSubTreeByPosition(originalTree, )
  //   result = result + addParents(originalTree, nextTree, v - 1)
  // }

  // return labelWithParents
}

/**
 * Extracts the labels of all children of a given tree
 * @param {SExpression} tree - Tree of symbols (terminals and or nonterminals)
 * @returns {string[]} Array of strings with all children of tree
 */
export function getChildrenLabels(tree: Array<SExpression>): string[] {
  const labels: string[] = []
  const [, ...children] = tree
  children.forEach(child => {
    if (typeof child === 'string') {
      labels.push(child)
    }
    if (Array.isArray(child)) {
      labels.push((child as Array<string>)[0])
    }
  })
  return labels
}

export function getChildren(tree: Array<SExpression>): SExpression[] {
  const [, ...children] = tree
  return children
}

// export function getOriginalLabel(label: string): string {
//   const originalLabel = ''
//   return originalLabel
// }

// /** Given a label, a tree and a number of vertical contexts, then returns a list
//  * of all the labels of the ancestors of the given label.
// * @param {SExpression} tree - Label which we want to modify by appending its parents to it.
// * @param {number} v - Number of vertical layers
// * @returns {string[]} String with given label and its parents appended in the correct form.
// */
// export function getAncestorsLabels(tree: SExpression, v: number): string[] {
//   if (v < 1) {
//     throw new Error()
//   }
//   const parent: string[] = []
//   return parent
// }

// function getLabel(tree: SExpression): string {
//   if (typeof tree === 'string') return tree
//   return (tree as Array<string>)[0]
// }

// function setLabel(tree: SExpression, label: string): void {
//   if (typeof tree === 'string') {
//     tree = label
//   } else {
//     (tree as Array<string>)[0] = label
//   }
// }

export function createSExpression(tree: SExpression, label: string): SExpression {
  return [label, tree]
}

// // v = 1 means that we only have one vertical context (the parent node)
// // h = infinite means that we have an infinity amount of horizontal contexts, that is ????
// export function markovize(tree: SExpression, v: number, h: number): SExpression {
//   const [label, ...children] = tree
//   if (isPreterminal(tree)) {
//     return tree
//   }
//   // Vertical Markovization
//   children.forEach(child => {
//     if (isPreterminal(child)) {
//       const _label = `${getLabel(child)}^`
//       setLabel(child, _label)
//     }
//   })

//   if (children.length === 1) {
//     return createSExpression(children[0], (label as string))
//   }

//   const _label = `@${label}->...`
//   const _tree: SExpression = horizontalMarkovization(tree, 0, _label)
//   return createSExpression(getChildren(_tree), label)

//   // const k = children.length
//   // if (k <= 2) {
//   //   addParents(label)
//   //   children.forEach(child => markovize(child, v, h))
//   // } else {
//   //   // const childrenLabels: string[] = getChildrenLabels((tree as Array<SExpression>))
//   //   // const _label = `${getOriginalLabel((label as string))}|<${childrenLabels}>`

//   // }
//   return []
// }

// export function horizontalMarkovization(tree: SExpression, n: number, label: string): SExpression {
//   const leftTree: SExpression = getLeftTree(tree)
//   const children: Array<SExpression> = []
//   children.push(markovize(leftTree, 1, 999))

//   if (n < tree.length - 2) {
//     const _label = ''
//   }
// }
export default class Binarise extends Command {
  static description = `Reads a sequence of constituent trees from stdin and 
  returns the respective binarized version of these trees in ths stdout.`

  static examples = [
    '$ pcfg_tool binarise -h grammar.rules grammar.lexicon',
  ]

  static flags = {
    horizontal: flags.string({char: 'h', description: '-h --horizontal=H\n Horizontal markovising with H. Default: infinite (999)'}),
    vertical: flags.string({char: 'v', description: '-v --vertical=V\n Vertical markovising with V. Default: 1'}),
  }

  static args = [
    {
      name: 'trees',
      required: false,
      description: 'Sequence of constituent trees',
    },
  ];

  async run() {
    console.log('Binariziiiiiing...')
    // const tree: SExpression = ['NP', 'John']
    // const binerizedTree: SExpression = markovize(tree, 1, 9999)
    // console.log(binerizedTree)
  }
}
