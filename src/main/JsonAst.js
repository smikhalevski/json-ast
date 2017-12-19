// @flow
import type {Json, JsonPrimitive} from './JsonType';
import {Visitor} from './Visitor';

export interface Node<K> {
  parent: ?ContainerNode<*, K>;
  getKey(): ?K;
  getParent(): ?ContainerNode<*, K>;
  setParent(parent: ?ContainerNode<*, K>): void;
  delete(): Node<*>;
  replace(node: Node<*>): Node<*>;
}

export interface ContainerNode<P, K> extends Node<P> {
  clear(): void;
  deleteChild(child: Node<K>): ContainerNode<P, K>;
  replaceChild(child: Node<K>, node: Node<*>): ContainerNode<P, K>;
  get(key: K): ?Node<K>;
  has(key: K): boolean;
  set(key: K, node: Node<*>): ContainerNode<P, K>;
  includes(node: Node<*>): boolean;
  entries(): Iterator<[K, Node<K>]>;
}

export class AbstractNode<K> implements Node<K> {

  parent: ?ContainerNode<*, K> = null;

  getKey(): ?K {
    if (this.parent) {
      const entries = this.parent.entries();
      for (const [key, node] of entries) {
        if (this === node) {
          return key;
        }
      }
    }
    return null;
  }

  getParent(): ?ContainerNode<*, K> {
    return this.parent;
  }

  setParent(parent: ?ContainerNode<*, K>): void {
    this.delete();
    this.parent = parent;
  }

  delete(): Node<*> {
    if (this.parent) {
      this.parent.deleteChild(this);
    }
    return this;
  }

  replace(node: Node<*>): Node<*> {
    if (this.parent) {
      this.parent.replaceChild(this, node);
    }
    return this;
  }
}

export class PrimitiveNode<K, V: JsonPrimitive> extends AbstractNode<K> {

  value: V;

  constructor(value: V) {
    super();
    this.value = value;
  }

  set(value: V) {
    this.value = value;
  }

  get(): V {
    return this.value;
  }
}

export class NumberNode<K> extends PrimitiveNode<K, number> {}

export class StringNode<K> extends PrimitiveNode<K, string> {}

export class BooleanNode<K> extends PrimitiveNode<K, boolean> {}

export class NullNode<K> extends PrimitiveNode<K, null> {

  constructor() {
    super(null);
  }
}

export class ArrayNode<K> extends AbstractNode<K> implements ContainerNode<K, number> {

  children: Node<number>[] = [];

  entries(): Iterator<[number, Node<*>]> {
    return this.children.entries();
  }

  clear(): void {
    this.children.length = 0;
  }

  deleteChild(child: Node<number>): ArrayNode<K> {
    if (this.includes(child)) {
      child.parent = null;
      this.children.splice(this.children.indexOf(child), 1);
    }
    return this;
  }

  replaceChild(child: Node<number>, node: Node<*>): ArrayNode<K> {
    if (this.includes(child)) {
      child.parent = null;
      node.setParent(this);
      this.children.splice(this.children.indexOf(child), 1, node);
    }
    return this;
  }

  get(index: number): ?Node<number> {
    return this.children[index];
  }

  has(index: number): boolean {
    return index in this.children;
  }

  set(index: number, node: Node<*>): ArrayNode<K> {
    const child = this.children[index];
    if (child) {
      child.parent = null;
    }
    node.setParent(this);
    this.children[index] = node;
    return this;
  }

  includes(node: Node<*>): boolean {
    return this.children.includes(node);
  }

  size(): number {
    return this.children.length;
  }

  push(...nodes: Node<number>[]): number {
    for (const node of nodes) {
      if (this.includes(node)) {
        continue;
      }
      node.setParent(this);
      this.children.push(node);
    }
    return this.size();
  }
}

export class ObjectNode<K> extends AbstractNode<K> implements ContainerNode<K, string> {

  children: Map<string, Node<string>> = new Map;

  entries(): Iterator<[string, Node<*>]> {
    return this.children.entries();
  }

  clear(): void {
    this.children.clear();
  }

  deleteChild(child: Node<string>): ObjectNode<K> {
    for (const [key, node] of this.entries()) {
      if (node === child) {
        this.children.delete(key);
        child.parent = null;
        break;
      }
    }
    return this;
  }

  replaceChild(child: Node<string>, node: Node<*>): ObjectNode<K> {
    for (const [key, existingChild] of this.entries()) {
      if (existingChild === child) {
        child.parent = null;
        node.setParent(this);
        this.children.set(key, node);
        break;
      }
    }
    return this;
  }

  get(key: string): ?Node<string> {
    return this.children.get(key);
  }

  has(key: string): boolean {
    return this.children.has(key);
  }

  set(key: string, node: Node<*>): ObjectNode<K> {
    const child = this.get(key);
    if (child) {
      child.parent = null;
    }
    node.setParent(this);
    this.children.set(key, node);
    return this;
  }

  includes(node: Node<*>): boolean {
    for (const [, child] of this.children) {
      if (child === node) {
        return true;
      }
    }
    return false;
  }
}

export async function traverseJsonAst(node: Node<*>, visitor: Visitor): Promise<Node<*>> {
  await visitor.visit(node);

  if (node instanceof ArrayNode || node instanceof ObjectNode) {
    for (const [, child] of node.entries()) {
      await traverseJsonAst(child, visitor);
    }
  }
  return node;
}

export function parseJson(value: Json): Node<*> {
  let node: Node<*>;

  if (Array.isArray(value)) {
    node = new ArrayNode();
    node.push(...value.map(parseJson));
    return node;
  }

  if (value === null) {
    return new NullNode();
  }

  switch (typeof value) {

    case 'object':
      node = new ObjectNode();
      for (const key in value) {
        node.set(key, parseJson(value[key]));
      }
      return node;

    case 'number':
      return new NumberNode(value);

    case 'string':
      return new StringNode(value);

    case 'boolean':
      return new BooleanNode(value);

    default: throw new TypeError(typeof value + ' is not supported');
  }
}

export function generateJson(node: Node<*>): Json {
  if (node instanceof ArrayNode) {
    const value = [];
    for (const [key, child] of node.entries()) {
      value[key] = generateJson(child);
    }
    return value;
  }
  if (node instanceof ObjectNode) {
    const value = {};
    for (const [key, child] of node.entries()) {
      value[key] = generateJson(child);
    }
    return value;
  }
  if (node instanceof PrimitiveNode) {
    return node.get();
  }
  throw new TypeError();
}
