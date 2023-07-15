import { vi } from "vitest";
import reducers from "@/store/auth/reducers";
import * as thunks from "@/store/auth/thunks";
import flushPromises from "flush-promises";
import * as firebaseAuth from "firebase/auth";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn().mockResolvedValue(true),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue(true),
  createAuthWithEmailAndPassword: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

describe("auth slice actions", () => {
  it("logout", () => {
    const state = { user: { uid: 101 } };
    reducers.logout(state);
    expect(state).not.toHaveProperty("user.uid");
  });
  it("store", () => {
    const state = { user: { uid: 101 } };
    global.localStorage = {};
    reducers.store(state);
    expect(global.localStorage).toHaveProperty("store/auth");
  });
  it("store", () => {
    const state = { user: null };
    global.localStorage = {
      "store/auth": JSON.stringify({ user: { uid: 101 } }),
    };
    reducers.restore(state);
    expect(state).toHaveProperty("user.uid", 101);
  });
});

describe("auth slice thunks", () => {
  const email = "me@my@.com";
  const password = "12345";
  it("login thunk calls API", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.login({ email, password });
    await action(dispatch, getState);
    await flushPromises();
    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
  it("register thunk calls API", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.register({ email, password });
    await action(dispatch, getState);
    await flushPromises();
    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
  it("forgot thunk calls API", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.forgot({ email });
    await action(dispatch, getState);
    await flushPromises();
    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});
