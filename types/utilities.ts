export type LeafValues<T> = T extends object ? LeafValues<T[keyof T]> : T;
