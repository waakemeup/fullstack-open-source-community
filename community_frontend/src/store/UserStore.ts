import { action, makeAutoObservable, observable } from "mobx";
import { User } from "../types/User";
import { useAuthState } from "../context/auth";
import { createContext } from "react";

class UserStore {
  @observable
  public user: User | null = null;

  constructor(user: User | null = null) {
    this.user = user;
    makeAutoObservable(this);
  }

  @action
  login(user: User | null) {
    this.user = user;
    console.log(this.user, user);
  }
}

export const UserStoreContext = createContext(new UserStore());
