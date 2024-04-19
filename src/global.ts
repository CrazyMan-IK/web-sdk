type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type UnionToTuple<T> = UnionToIntersection<T extends any ? (t: T) => T : never> extends (_: any) => infer W ? [...UnionToTuple<Exclude<T, W>>, W] : [];

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export function keyof<O extends {}, K extends keyof O, R extends UnionToTuple<K> extends [K] ? K : unknown>(oneProperty: O): R {
  const keyList = Object.keys(oneProperty);
  return (keyList.length === 1 ? keyList[0] : undefined) as unknown as R;
}
