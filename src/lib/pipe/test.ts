import { createPipe, Pipe } from ".";

test("listen", () => {
  let result: string = "";
  const pipe = createPipe<string>().listen((value) => (result = value));

  pipe.resolve("123");

  expect(result).toBe("123");
});

test("listen with key", async () => {
  const pipe = createPipe<string>().listen((value) => [value], "key-action");

  const resultResolve = await pipe.resolve("123");

  expect(resultResolve.has("key-action")).toBe(true);
  expect(resultResolve.get("key-action")).toEqual(["123"]);
});

test("resolve with action", async () => {
  const pipe = createPipe<string>().listen(
    (value, action) => (action === "link" ? `${value}-${value}` : [value]),
    "key-action",
  );

  const resultResolve1 = await pipe.resolve("123");

  expect(resultResolve1.has("key-action")).toBe(true);
  expect(resultResolve1.get("key-action")).toEqual(["123"]);

  const resultResolve2 = await pipe.resolve("asd", "link");

  expect(resultResolve2.has("key-action")).toBe(true);
  expect(resultResolve2.get("key-action")).toEqual("asd-asd");
});

test("next", async () => {
  const pipeRoot = createPipe<number>();
  let pupeSub1Result: string = "";
  let pupeSub1Action: string | undefined;

  pipeRoot
    .next((value) => [value, value, value], "pipe-sub-1")
    .next((value, action) => {
      pupeSub1Result = value.join("-");
      pupeSub1Action = action;
      return pupeSub1Result;
    }, "pipe-sub-1-1");

  pipeRoot.next((value) => value * 10, "pipe-sub-2");

  const pipeRootResult = await pipeRoot.resolve(123, "stream");

  expect(pipeRootResult.get("pipe-sub-1")).toEqual([123, 123, 123]);
  expect(pipeRootResult.get("pipe-sub-2")).toEqual(1230);
  expect(pupeSub1Result).toBe("123-123-123");
  expect(pupeSub1Action).toBe("stream");
});

test("next subpipe", async () => {
  const pipeRoot = createPipe<string>();
  const subpipe = createPipe<number>();
  let subpipeValue: number = -1;

  pipeRoot.next(() => subpipe).listen((value) => (subpipeValue = value));

  await pipeRoot.resolve("asd");
  await new Promise((resolve) =>
    setTimeout(() => {
      subpipe.resolve(123);
      resolve();
    }, 1000),
  );

  expect(subpipeValue).toBe(123);
});

test("next async", async () => {
  const pipeRoot = createPipe<string>();
  let subpipe: Pipe<number>;
  let subpipeValue: number = -1;

  pipeRoot.listen(async (value) => `@${value}`, "listen-1");
  pipeRoot.listen(async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `@${value}@`;
  }, "listen-2");
  pipeRoot.next(async (value) => [value, value], "subpipe-1");
  pipeRoot.next(async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [value, value, value];
  }, "subpipe-2");
  pipeRoot
    .next(async () => {
      subpipe = createPipe<number>();
      return subpipe;
    })
    .listen((value) => (subpipeValue = value));

  const result = await pipeRoot.resolve("asd", "stream");
  await new Promise((resolve) =>
    setTimeout(() => {
      subpipe.resolve(123);
      resolve();
    }, 1000),
  );

  expect(result.get("listen-1")).toBe("@asd");
  expect(result.get("listen-2")).toBe("@asd@");
  expect(result.get("subpipe-1")).toEqual(["asd", "asd"]);
  expect(result.get("subpipe-2")).toEqual(["asd", "asd", "asd"]);
  expect(subpipeValue).toBe(123);
});

test("resolvedStore", async () => {
  const pipe = createPipe<string>();

  pipe.listen((value) => `${value}-${value}`, "listener");

  await pipe.resolve("asd");
  await pipe.resolve("qwe");

  expect(pipe.resolvedStore().get("listener")).toEqual([{ value: "qwe-qwe" }]);
});

test("resolvedStore with save", async () => {
  const pipe = createPipe<string>({ saveResolveResult: true });

  pipe.listen((value) => `${value}-${value}`, "listener");

  await pipe.resolve("asd");
  await pipe.resolve("qwe");
  await pipe.resolve("0", "close");

  expect(pipe.resolvedStore().get("listener")).toEqual([
    { value: "asd-asd" },
    { value: "qwe-qwe" },
    { value: "0-0", action: "close" },
  ]);
});
