// @flow
import type {Node} from './JsonAst';
import {PrimitiveNode, ArrayNode, BooleanNode, NullNode, NumberNode, ObjectNode, StringNode} from './JsonAst';

export type Awaitable<T> = T | Promise<T>;

export class Visitor {
  visit(node: Node<*>): Awaitable<*> {}
}

export class JsonVisitor extends Visitor {

  async visit(node: Node<*>): Awaitable<*> {
    if (node instanceof PrimitiveNode) {
      await this.visitPrimitive(node);
    }
    if (node instanceof NumberNode) {
      await this.visitNumber(node);
    }
    if (node instanceof StringNode) {
      await this.visitString(node);
    }
    if (node instanceof BooleanNode) {
      await this.visitBoolean(node);
    }
    if (node instanceof NullNode) {
      await this.visitNull(node);
    }
    if (node instanceof ArrayNode) {
      await this.visitArray(node);
    }
    if (node instanceof ObjectNode) {
      await this.visitObject(node);
    }
  }

  visitPrimitive(node: PrimitiveNode<*, *>): Awaitable<*> {}
  visitNumber(node: NumberNode<*>): Awaitable<*> {}
  visitString(node: StringNode<*>): Awaitable<*> {}
  visitBoolean(node: BooleanNode<*>): Awaitable<*> {}
  visitNull(node: NullNode<*>): Awaitable<*> {}
  visitArray(node: ArrayNode<*>): Awaitable<*> {}
  visitObject(node: ObjectNode<*>): Awaitable<*> {}
}
