import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" });
  // 'network-only' -> wont read from cache
  if (!data || loading) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      Users:
      <ul>
        {data.users.map((x) => (
          <li key={x.id}>
            {x.email}, {x.id}
          </li>
        ))}
      </ul>
    </div>
  );
};
