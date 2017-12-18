// @flow
export type Json = JsonPrimitive | JsonArray | JsonObject;

export type JsonPrimitive = string | number | boolean | null;

export type JsonArray = Json[];

export type JsonObject = {
  [key: string]: Json;
};
