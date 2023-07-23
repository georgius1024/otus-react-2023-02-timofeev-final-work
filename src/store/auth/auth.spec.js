import { vi } from "vitest";
import reducers from "@/store/auth/reducers";
import * as thunks from "@/store/auth/thunks";
import flushPromises from "flush-promises";
import * as auth from "@/services/auth";
import * as users from "@/services/users";

vi.mock("@/services/auth", () => ({
  login: vi.fn().mockResolvedValue({ uid: "123", email: "some@em.ail" }),
  register: vi.fn().mockResolvedValue({ uid: "123", email: "some@em.ail" }),
  forgot: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/services/users", () => ({
  fechAccess: vi.fn().mockResolvedValue("*"),
  fetchUser: vi.fn().mockResolvedValue({
    id: "abacdef0123456789",
    uid: "1234",
    email: "none@nowhere.com",
    name: "User name",
  }),
  findWithUid: vi.fn().mockImplementation((uid) => {
    if (!uid) {
      return null;
    }
    return {
      id: "abacdef0123456789",
      uid: "1234",
      email: "none@nowhere.com",
      name: "User name",
    };
  }),
  update: vi.fn().mockResolvedValue(),
  create: vi.fn().mockResolvedValue({
    id: "abacdef0123456789",
    uid: "1234",
    email: "none@nowhere.com",
    name: "User name",
  }),
}));

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
    expect(auth.login).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
  it("register thunk calls API", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.register({ email, password });
    await action(dispatch, getState);
    await flushPromises();
    expect(auth.register).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
  it("forgot thunk calls API", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.forgot({ email });
    await action(dispatch, getState);
    await flushPromises();
    expect(auth.forgot).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it("updateProfile calls users module update when user exists", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.updateProfile({ profile: { uid: '123', name: "Updated" } });
    await action(dispatch, getState);
    await flushPromises();
    expect(users.update).toHaveBeenCalled();
  });

  it("updateProfile calls users module create when user not exists", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const action = thunks.updateProfile({ profile: {name: "Updated" } });
    await action(dispatch, getState);
    await flushPromises();
    expect(users.create).toHaveBeenCalled();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
