import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "./accessToken";
import { useLogoutMutation, useMeQuery } from "./generated/graphql";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const [logout, { client }] = useLogoutMutation();
  const { data, loading } = useMeQuery({ fetchPolicy: "network-only" });

  return (
    <header>
      <button
        onClick={async () => {
          await logout();
          setAccessToken("");
          client?.resetStore();
        }}
      >
        Logout
      </button>
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/check">Check</Link>
        </div>
        {data && data.me ? (
          <div>You are logged in as {data.me.email} </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};
