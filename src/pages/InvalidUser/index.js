import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { logIn, clearAuth } from "src/store/actions/authActions";
import no_user_found from "src/images/no-results.png";
import { Container, Paper, Typography } from "@material-ui/core";

const InvalidUser = (props) => {
  const {
    // from mapstate
    loggedUser,
  } = props;

  return !loggedUser ? (
    <Redirect to="/login" />
  ) : (
    <Container maxWidth="sm" className="p-3">
      <Paper className="d-flex flex-column p-5">
        <img
          src={no_user_found}
          alt="no user"
          width="150"
          className="align-self-center"
        />
        <Typography variant="h5" className="align-self-center mt-3">
          User not found.
        </Typography>
        <Typography
          variant="subtitle1"
          className="align-self-center"
          color="textSecondary"
        >
          Please return to the main page.
        </Typography>
      </Paper>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps, { logIn, clearAuth })(InvalidUser);
