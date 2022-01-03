import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
} from "@material-ui/core";
import { logIn, clearAuth } from "../../store/actions/authActions";
import "./index.scss";
import { connect } from "react-redux";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router";

const Login = (props) => {
  const {
    // from mapdispatch
    logIn,
    clearAuth,
    // from mapstate
    loggedUser,
    authError,
    isPosting,
  } = props;
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      clearAuth();
      isInitialLoad.current = false;
    }
  }, [authError, clearAuth]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isDisableReset = !username && !password;
  const isDisableSave = !username || !password;

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn({ username: username.toLowerCase(), password });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
  };

  const handleChange = (e) => {
    e.preventDefault();
    !!authError && clearAuth();

    const fieldName = e.target.name;
    const value = e.target.value;

    if (fieldName === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  return !!loggedUser ? (
    <Redirect to="/dashboard" />
  ) : (
    <Container maxWidth="sm" className="loginContainer pt-3">
      <Paper className="p-3">
        <h2 className="mb-3">Login</h2>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="sectionWrapper mb-3">
            <span className="d-block">
              Username<span className="text-danger ms-1">*</span>
            </span>
            <TextField
              name="username"
              value={username.toLowerCase()}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>
          <div className="sectionWrapper mb-3">
            <span className="d-block">
              Password<span className="text-danger ms-1">*</span>
            </span>
            <TextField
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>
          {!!authError && (
            <Alert severity="error" className="mt-3">
              {authError}
            </Alert>
          )}
          <div className="d-flex justify-content-end mt-3">
            {!isPosting && (
              <Button
                className="me-3"
                type="reset"
                color="secondary"
                variant="contained"
                disableElevation
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={isPosting || isDisableReset}
              >
                Clear
              </Button>
            )}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disableElevation
              disableFocusRipple
              disableRipple
              disableTouchRipple
              disabled={isPosting || isDisableSave}
            >
              {isPosting ? (
                <>
                  <CircularProgress
                    color="inherit"
                    size="20px"
                    className="me-2"
                  />
                  Logging in
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.loggedUser,
    authError: state.auth.authError,
    isPosting: state.auth.isPosting || false,
  };
};

export default connect(mapStateToProps, { logIn, clearAuth })(Login);
