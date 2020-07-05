import React from "react";
import { useCheckProtectedRouteQuery } from "../generated/graphql";

interface CheckProps {}

export const Check: React.FC<CheckProps> = ({}) => {
  const { data, loading, error } = useCheckProtectedRouteQuery();
  if (error) {
    console.log("error", error);
    return <div>Error occured</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return <div>I am protected: {data.protected}</div>;
};
