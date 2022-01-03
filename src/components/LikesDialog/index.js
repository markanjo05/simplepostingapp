import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./index.scss";
import { UserAvatar } from "..";

function LikesDialog(props) {
  const {
    // from passed props
    isOpen,
    handleToggleLikeDialog,
    // from mapstate
    loggedUser,
    postLikers = [],
    usersList,
  } = props;
  return (
    <Dialog
      onClose={handleToggleLikeDialog}
      open={isOpen}
      fullWidth
      maxWidth="xs"
      className="likesDialogWrapper"
    >
      <DialogTitle className="pt-2 pb-2 ps-3 pe-3">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <span className="fw-bold">Likes</span>
          <IconButton onClick={handleToggleLikeDialog}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers className="ps-3 pe-3 p-0">
        {!!postLikers &&
          postLikers?.map((liker) => {
            const likerData = usersList?.find((user) => user.id === liker.id);

            return (
              !!likerData && (
                <div
                  key={liker.id}
                  className="d-flex align-items-center mt-3 mb-3"
                >
                  <UserAvatar
                    src={likerData?.avatar}
                    alt={likerData?.initials}
                  />
                  <Link
                    to={`/profile/${liker.id}`}
                    className="likerLink ms-3 me-3"
                  >
                    {`${liker.firstName} ${liker.lastName}`}
                    {loggedUser?.id === liker.id && " (You)"}
                  </Link>
                </div>
              )
            );
          })}
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.loggedUser,
    usersList: state.users.list,
    postLikers: state.posts.postLikers,
  };
};

export default connect(mapStateToProps)(LikesDialog);
