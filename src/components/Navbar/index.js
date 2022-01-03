import React, { useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getLoggedUserData, logOut } from "src/store/actions/authActions";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { getUsers } from "src/store/actions/usersActions";
import "./index.scss";
import { UserAvatar } from "..";

const Navbar = (props) => {
  const {
    // from mapstate
    loggedUser,
    // from mapdispatch
    logOut,
    getLoggedUserData,
    getUsers,
  } = props;
  const { id } = useParams();

  useEffect(() => {
    !!loggedUser?.username && getLoggedUserData();
  }, [getLoggedUserData, loggedUser?.username]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <AppBar position="fixed" className="navbarWrapper p-0">
      <Container maxWidth="md" disableGutters>
        <Toolbar>
          <Button
            href="/dashboard"
            className="text-white appLogo p-0 align-self-center justify-content-center me-auto"
            disableRipple
            disableElevation
            variant="text"
          >
            <Typography variant="h6" className="d-flex align-items-center">
              <LayersIcon className="me-2" />
              <span className="d-none d-md-block">Simple Posting App</span>
            </Typography>
          </Button>
          <div className="ms-auto" id={id}>
            {!!loggedUser?.id ? (
              <div className="d-flex align-items-center">
                <Button
                  href={`/profile/${loggedUser?.id}`}
                  className={`profileButton me-1 d-flex align-items-center justify-content-center ${
                    document.location.pathname.includes(
                      `/profile/${loggedUser?.id}`
                    )
                      ? "active"
                      : ""
                  }`}
                  disableRipple
                  disableElevation
                  variant="text"
                >
                  <UserAvatar
                    className="avatar"
                    src={loggedUser?.avatar}
                    alt={loggedUser?.initials}
                  />
                  {/* <span className="d-none d-md-block text-white ms-2"> */}
                  <span className="text-white ms-2">
                    {loggedUser?.firstName}
                  </span>
                </Button>
                <IconButton
                  onClick={logOut}
                  color="inherit"
                  className="logoutButton"
                >
                  <ExitToAppIcon />
                </IconButton>
              </div>
            ) : (
              <>
                <Link to="/signup" className="ms-2 me-2 text-white">
                  Sign up
                </Link>
                <Link to="/login" className="ms-2 me-2 text-white">
                  Log in
                </Link>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.loggedUser,
  };
};

export default compose(
  connect(mapStateToProps, { logOut, getLoggedUserData, getUsers })
)(Navbar);
