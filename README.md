# JSON AST Visitor

JSON abstract syntax tree parser, visitor and serializer.

```js
import {parseJson, traverseJsonAst, generateJson, Visitor} from 'json-ast-visitor';

const json = [{foo: 'bar'}];
const jsonAst = parseJson(json);

class FooVisitor extends Visitor {
  
  visitPrimitive(node) {
    if (node.getKey() === 'foo') {
      node.set('qux');
    }
  }
}

traverseJsonAst(jsonAst, new FooVisitor())
  .then(generateJson)
  .then(json => console.log(json)) // → [{foo: 'qux'}]

```

## Scripts

`npm run flow` Run Flow type checks.

`npm test` Run Jest test suite.

`npm run build` Build project into `target/out` directory.
