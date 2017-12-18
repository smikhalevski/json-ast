import {ArrayNode, generateJson, ObjectNode, parseJson, PrimitiveNode, traverseJsonAst, Visitor} from '../main/JsonAst';

describe('ArrayNode.entries', () => {

  it('return entries of an array', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1, node2);
    expect(Array.from(arrayNode.entries())).toEqual([[0, node1], [1, node2]]);
  });
});

describe('ArrayNode.clear', () => {

  it('clears array and preserves reference to children', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1, node2);
    const children = arrayNode.children;
    arrayNode.clear();
    expect(arrayNode.children).toBe(children);
    expect(arrayNode.size()).toBe(0);
  });
});

describe('ArrayNode.deleteChild', () => {

  it('deletes child from an array if it exists', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node);
    expect(arrayNode.deleteChild(node)).toBe(arrayNode);
    expect(node.getParent()).toBeNull();
  });

  it('does nothing if provided node is not a child of this array', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    expect(arrayNode.deleteChild(node)).toBe(arrayNode);
    expect(node.getParent()).toBeNull();
  });
});

describe('ArrayNode.replaceChild', () => {

  it('deletes child from an array if it exists', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1);
    expect(arrayNode.replaceChild(node1, node2)).toBe(arrayNode);
    expect(node1.getParent()).toBeNull();
    expect(node2.getParent()).toBe(arrayNode);
  });

  it('deletes node from current parent before replacement', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode1 = new ArrayNode;
    const arrayNode2 = new ArrayNode;
    arrayNode1.push(node1);
    arrayNode2.push(node2);
    expect(arrayNode1.replaceChild(node1, node2)).toBe(arrayNode1);
    expect(node1.getParent()).toBeNull();
    expect(node2.getParent()).toBe(arrayNode1);
    expect(arrayNode2.size()).toBe(0);
  });

  it('does nothing if provided node is not a child of this array', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const node3 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1);
    arrayNode.replaceChild(node2, node3);
    expect(node1.getParent()).toBe(arrayNode);
  });

  it('moves node to new position if it is chid of an array', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1, node2);
    arrayNode.replaceChild(node1, node2);
    expect(node1.getParent()).toBeNull();
    expect(node2.getParent()).toBe(arrayNode);
    expect(arrayNode.size()).toBe(1);
    expect(arrayNode.get(0)).toBe(node2);
  });
});

describe('ArrayNode.get', () => {

  it('returns child node by index', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1, node2);
    expect(arrayNode.get(1)).toBe(node2);
  });
});

describe('ArrayNode.has', () => {

  it('returns true if provided key is in this array', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node);
    expect(arrayNode.has(0)).toBeTruthy();
  });

  it('returns false if provided key is not in this array', () => {
    const arrayNode = new ArrayNode;
    expect(arrayNode.has(0)).toBeFalsy();
  });
});

describe('ArrayNode.set', () => {

  it('sets node to particular index', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.set(1, node);
    expect(arrayNode.get(1)).toBe(node);
    expect(node.getParent()).toBe(arrayNode);
  });

  it('deletes node from current parent before setting a new one', () => {
    const node = new PrimitiveNode();
    const arrayNode1 = new ArrayNode;
    const arrayNode2 = new ArrayNode;
    arrayNode1.push(node);
    arrayNode2.set(1, node);
    expect(arrayNode2.get(1)).toBe(node);
    expect(node.getParent()).toBe(arrayNode2);
    expect(arrayNode1.size()).toBe(0);
  });
});

describe('ArrayNode.includes', () => {

  it('returns true if provided node is a child of this array', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node);
    expect(arrayNode.includes(node)).toBeTruthy();
  });

  it('returns false if provided node not is a child of this array', () => {
    const node = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    expect(arrayNode.includes(node)).toBeFalsy();
  });
});

describe('ArrayNode.size', () => {

  it('returns number of children in array', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    arrayNode.push(node1, node2);
    expect(arrayNode.size()).toBe(2);
  });
});

describe('ArrayNode.push', () => {

  it('pushes list of provided nodes to array', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const arrayNode = new ArrayNode;
    expect(arrayNode.push(node1, node2)).toBe(2);
    expect(arrayNode.includes(node1)).toBeTruthy();
    expect(arrayNode.includes(node2)).toBeTruthy();
  });
});



describe('ObjectNode.entries', () => {

  it('return entries of an object', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node1);
    objectNode.set('a2', node2);
    expect(Array.from(objectNode.entries())).toEqual([['a1', node1], ['a2', node2]]);
  });
});

describe('ObjectNode.clear', () => {

  it('clears object and preserves reference to children', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node1);
    objectNode.set('a2', node1);
    const children = objectNode.children;
    objectNode.clear();
    expect(objectNode.children).toBe(children);
    expect(Array.from(objectNode.entries())).toEqual([]);
  });
});

describe('ObjectNode.deleteChild', () => {

  it('deletes child from an object if it exists', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node);
    expect(objectNode.deleteChild(node)).toBe(objectNode);
    expect(node.getParent()).toBeNull();
  });

  it('does nothing if provided node is not a child of this object', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    expect(objectNode.deleteChild(node)).toBe(objectNode);
    expect(node.getParent()).toBeNull();
  });
});

describe('ObjectNode.replaceChild', () => {

  it('deletes child from an object if it exists', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node1);
    expect(objectNode.replaceChild(node1, node2)).toBe(objectNode);
    expect(node1.getParent()).toBeNull();
    expect(node2.getParent()).toBe(objectNode);
    expect(objectNode.get('a1')).toBe(node2);
  });

  it('deletes node from current parent before replacement', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const objectNode1 = new ObjectNode;
    const objectNode2 = new ObjectNode;
    objectNode1.set('a1', node1);
    objectNode2.set('a2', node2);
    expect(objectNode1.replaceChild(node1, node2)).toBe(objectNode1);
    expect(node1.getParent()).toBeNull();
    expect(node2.getParent()).toBe(objectNode1);
    expect(objectNode2.get('a2')).toBeUndefined();
  });

  it('does nothing if provided node is not a child of this object', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const node3 = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node1);
    objectNode.replaceChild(node2, node3);
    expect(objectNode.get('a1')).toBe(node1);
    expect(node1.getParent()).toBe(objectNode);
  });
});

describe('ObjectNode.get', () => {

  it('returns child node by key', () => {
    const node1 = new PrimitiveNode();
    const node2 = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node1);
    objectNode.set('a2', node2);
    expect(objectNode.get('a1')).toBe(node1);
    expect(objectNode.get('a2')).toBe(node2);
  });
});

describe('ObjectNode.has', () => {

  it('returns true if provided key is in this object', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node);
    expect(objectNode.has('a1')).toBeTruthy();
  });

  it('returns false if provided key is not in this object', () => {
    const objectNode = new ObjectNode;
    expect(objectNode.has('a1')).toBeFalsy();
  });
});

describe('ObjectNode.set', () => {

  it('sets node to particular index', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node);
    expect(objectNode.get('a1')).toBe(node);
    expect(node.getParent()).toBe(objectNode);
  });

  it('deletes node from current parent before setting a new one', () => {
    const node = new PrimitiveNode();
    const objectNode1 = new ObjectNode;
    const objectNode2 = new ObjectNode;
    objectNode1.set('a1', node);
    objectNode2.set('a1', node);
    expect(objectNode2.get('a1')).toBe(node);
    expect(node.getParent()).toBe(objectNode2);
    expect(Array.from(objectNode1.entries())).toEqual([]);
  });
});

describe('ObjectNode.includes', () => {

  it('returns true if provided node is a child of this object', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    objectNode.set('a1', node);
    expect(objectNode.includes(node)).toBeTruthy();
  });

  it('returns false if provided node not is a child of this object', () => {
    const node = new PrimitiveNode();
    const objectNode = new ObjectNode;
    expect(objectNode.includes(node)).toBeFalsy();
  });
});

describe('traverseJsonAst', () => {

  test('visits nested nodes', async () => {
    const visitor = new Visitor();
    visitor.visitPrimitive = jest.fn();
    const node = parseJson({a: {b: 1}});
    await traverseJsonAst(
        node,
        visitor
    );
    expect(visitor.visitPrimitive).toHaveBeenLastCalledWith(node.get('a').get('b'));
  });
});

describe('parseJson', () => {

  it('can parse JSON to AST', () => {
    const ast = parseJson([{a1: 123}]);
    expect(ast instanceof ArrayNode).toBeTruthy();
    expect(ast.get(0) instanceof ObjectNode).toBeTruthy();
    expect(ast.get(0).get('a1') instanceof PrimitiveNode).toBeTruthy();
  });
});

describe('generateJson', () => {

  it('can generate JSON from AST', () => {
    const json = [{a1: 'a1v', a2: {b1: 'b1v'}}];
    const ast = parseJson(json);

    expect(generateJson(ast)).toEqual(json);
  });

  it('throws on non-Node input', () => {
    expect(() => generateJson(null)).toThrow();
    expect(() => generateJson('foo')).toThrow();
    expect(() => generateJson({})).toThrow();
  });
});

describe('Documentation examples', () => {

  it('end-to-end example', done => {
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
      .then(json => {
        expect(json).toEqual([{foo: 'qux'}]);
        done();
      });
  });
});
