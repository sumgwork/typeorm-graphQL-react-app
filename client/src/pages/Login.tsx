import React, { useState } from "react";
import { useLoginMutation, MeDocument, MeQuery } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../accessToken";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await login({
            variables: {
              email,
              password,
            },
            update: (store, { data }) => {
              if (!data) {
                return null;
              }
              store.writeQuery<MeQuery>({
                // apollo store
                query: MeDocument,
                data: {
                  me: data.login.user,
                },
              });
            },
          });

          if (response?.data) {
            setAccessToken(response.data.login.accessToken);
          }
          // history.push("/");
        }}
      >
        <div>
          <input
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            value={password}
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
