import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { logIn, clearAuth } from "src/store/actions/authActions";
import page_not_found from "src/images/page-not-found.png";
import { Container, Paper, Typography } from "@material-ui/core";

const InvalidPage = (props) => {
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
          src={page_not_found}
          alt="no user"
          width="150"
          className="align-self-center"
        />
        <Typography variant="h5" className="align-self-center mt-3">
          Oops, page not found.
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

export default connect(mapStateToProps, { logIn, clearAuth })(InvalidPage);
