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

vi.mock("@/services/users", () => ({
  fechAccess: vi.fn().mockResolvedValue('*'),
  fetchUser: vi.fn().mockResolvedValue({
    id: 'abacdef0123456789',
    uid: '1234',
    email: 'none@nowhere.com',
    name: 'User name'
  }),
  findWithUid: vi.fn().mockResolvedValue({
    id: 'abacdef0123456789',
    uid: '1234',
    email: 'none@nowhere.com',
    name: 'User name'
  }), 
  update: vi.fn().mockResolvedValue(),
  create: vi.fn().mockResolvedValue({
    id: 'abacdef0123456789',
    uid: '1234',
    email: 'none@nowhere.com',
    name: 'User name'
  })
}))

describe("auth slice actions", () => {
  it("logout", () => {
    const state = { auth: { uid: 101 } };
    reducers.logout(state);
    expect(state).not.toHaveProperty("user.uid");
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
  // it("updateProfile calls users module", async () => {
  //   const dispatch = vi.fn();
  //   const getState = vi.fn();
  //   const action = thunks.updateProfile({ name: 'Updated' });
  //   await action(dispatch, getState);
  //   await flushPromises();
  //   expect(users.update).toHaveBeenCalled();
  // })

  afterEach(() => {
    vi.clearAllMocks()
  })
});
