/** Retrieves the current time in milliseconds, similar to `Date.now()`. */
export type Time = Readonly<{
  readonly now: () => number;
}>;

export type TimeDep = Readonly<{
  time: Time;
}>;

/** Creates a {@link Time} using Date.now(). */
export const createTime = (): Time => ({
  now: () => Date.now(),
});
