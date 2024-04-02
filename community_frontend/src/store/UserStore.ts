import { action, makeAutoObservable, observable } from "mobx";
import { User } from "../types/User";
import { useAuthState } from "../context/auth";
import { createContext } from "react";
import { makePersistable } from "mobx-persist-store";
import LevelEnum from "../types/enums/LevelEnum";
import RoleEnum from "../types/enums/RoleEnum";

class UserStore {
  @observable
  public user: User | null = null;

  @observable
  public authenticated: boolean = this.user !== null;

  constructor(user: User | null = null, authenticated: boolean = false) {
    this.user = user;
    this.authenticated = authenticated;
    makeAutoObservable(this);

    makePersistable(this, {
      name: "userStore",
      properties: ["user", "authenticated"],
      stringify: true,
      expireIn: 86400000,
      storage: window.localStorage,
    });
  }

  @action
  login(user: User | null) {
    this.user = user;
    this.authenticated = true;
    console.log(this.user, user);
  }

  @action
  logout() {
    this.user = null;
    this.authenticated = false;
  }

  @observable
  public get isUserAndStudent(): boolean {
    return (
      this.user?.level === LevelEnum.STUDENT && this.user.role === RoleEnum.USER
    );
  }
}

export const UserStoreContext = createContext(new UserStore());
