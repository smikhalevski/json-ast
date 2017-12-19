# JSON AST Visitor

JSON abstract syntax tree parser, visitor and serializer.

```js
import {parseJson, traverseJsonAst, generateJson, JsonVisitor, NumberNode} from 'json-ast-visitor';

const json = [{foo: 'bar'}];
const jsonAst = parseJson(json);

class FooVisitor extends JsonVisitor {

  visitString(node) {
    if (node.getKey() === 'foo') {
      node.replace(new NumberNode(123));
    }
  }
}

traverseJsonAst(jsonAst, new FooVisitor())
  .then(generateJson)
  .then(json => console.log(json)) // → [{foo: 123}]

```

## Scripts

`npm run flow` Run Flow type checks.

`npm test` Run Jest test suite.

`npm run build` Build project into `target/out` directory.
