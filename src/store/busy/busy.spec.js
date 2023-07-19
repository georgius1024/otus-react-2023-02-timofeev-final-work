import reducers from "@/store/busy/reducers";

describe("busy slice actions", () => {
  it("set", () => {
    const state = { busy: false };
    reducers.set(state, {
      payload: true,
    });
    expect(state).toHaveProperty("busy", true);
  });
});
