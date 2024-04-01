import React, { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types/User";
import axios from "../api";
import { message } from "mui-message";

interface State {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext<any>(null);

const reducer = (state: State, { payload, type }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "REGISTER":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "REFRESH":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
        loading: false,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknow action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/auth/refresh");
        // console.log(res);
        dispatch("REFRESH", res.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
export const signOut = async (dispatch: any) => {
  // dispatch({
  //   type: "LOGOUT",
  // });
  try {
    const res = await axios.post("/auth/logout");
    console.log("res:" + res.status);
    if (res.status === 200) {
      dispatch("LOGOUT");
    }
  } catch (error) {
    message.error("登出失败");
  }
};
