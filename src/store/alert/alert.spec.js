import reducers from "@/store/alert/reducers";

describe("alert slice actions", () => {
  it("raise", () => {
    const state = { alerts: [] };
    reducers.raise(state, {
      payload: { text: "message", severity: "severity" },
    });
    expect(state).toHaveProperty("alerts.0.text", "message");
  });
  it("cleanup", () => {
    const state = { alerts: [{
      raisedAt: 0
    }] };
    reducers.cleanup(state, {
      payload: 1,
    });
    expect(state.alerts).toHaveLength(0);
  });
});
