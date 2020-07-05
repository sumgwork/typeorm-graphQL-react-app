import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <header>
          <div>
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/register">Register</Link>
            </div>
            <div>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
