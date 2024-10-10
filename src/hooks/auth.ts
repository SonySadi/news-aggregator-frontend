import { useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setToken, logout as logoutAction } from "../lib/reducer/auth";
import { RootState } from "../lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

interface User {
  id: number;
  name: string;
  email: string;
  preferred_sources: string[];
  preferred_authors: string[];
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const setAuthData = (user: User | null, token: string | null) => {
    dispatch(setUser(user));
    dispatch(setToken(token));
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string
    ) => {
      try {
        const response = await axios.post(`${API_URL}/api/register`, {
          name,
          email,
          password,
          password_confirmation,
        });
        setAuthData(response.data.user, response.data.access_token);
        return response.data;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });
      setAuthData(response.data.user, response.data.access_token);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(logoutAction());
      setAuthData(null, null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, [token, dispatch]);

  const updatePreferences = useCallback(
    async (preferences: Partial<User>) => {
      try {
        const response = await axios.put(
          `${API_URL}/api/user/preferences`,
          preferences,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setUser({ ...user, ...response.data }));
        return response.data;
      } catch (error) {
        console.error("Updating preferences failed:", error);
        throw error;
      }
    },
    [token, user, dispatch]
  );

  return {
    user,
    token,
    register,
    login,
    logout,
    updatePreferences,
  };
};
