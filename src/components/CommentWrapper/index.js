import React, { useState } from "react";
import {
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import moment from "moment";
import MoreVertRoundedIcon from "@material-ui/icons/MoreVertRounded";
import CancelPresentationRoundedIcon from "@material-ui/icons/CancelPresentationRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import PostDialog from "src/components/PostDialog";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteComment,
  hideComment,
  updateComment,
} from "src/store/actions/postsActions";
import "./index.scss";
import { UserAvatar } from "..";

function CommentWrapper(props) {
  const {
    // from passed props
    post,
    comment,
    // from mapstate,
    authorData,
    loggedUser,
    // from mapdispatch
    deleteComment,
    updateComment,
    hideComment,
  } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isYou = loggedUser?.id === comment.author;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment = () => {
    deleteComment(post.id, comment.id);
    handleClose();
  };

  const handleOnUpdateComment = ({ content }) => {
    updateComment(post.id, comment.id, content);
  };

  const handleHideComment = () => {
    hideComment(post.id, comment.id);
    handleClose();
  };

  return (
    <div
      key={comment.id}
      className="commentWrapper d-flex align-items-top w-100 mt-2 mb-2"
    >
      <Link to={`/profile/${comment.author}`}>
        <UserAvatar
          className="commentAvatar"
          src={authorData?.avatar}
          alt={authorData?.initials}
        />
      </Link>
      <div className="commentWrapper w-100 ms-2">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <Link to={`/profile/${comment.author}`} className="postAuthorLink">
              {`${authorData.firstName} ${authorData.lastName}`}{" "}
              {isYou && " (You)"}
            </Link>
            ・{moment(comment.createdAt).fromNow()}
          </div>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={!!anchorEl}
            onClose={handleClose}
            className={classes.menuWrapper}
            transitionDuration={0}
            elevation={1}
          >
            <MenuList className={classes.menuList}>
              {isYou && [
                <PostDialog
                  key={`editComment-${comment.id}`}
                  dialogHeaderLabel="Edit comment"
                  submitAction={handleOnUpdateComment}
                  content={comment.content}
                  actionComponent={
                    <MenuItem
                      onClick={handleClose}
                      className={classes.menuItem}
                    >
                      <EditRoundedIcon fontSize="small" className="me-3" />
                      Edit comment
                    </MenuItem>
                  }
                  isNewPost={false}
                  hasImage={false}
                />,
              ]}
              {(isYou || post.author === loggedUser?.id) && [
                <MenuItem
                  key={`deleteComment-${comment.id}`}
                  onClick={handleDeleteComment}
                  className={classes.menuItem}
                >
                  <DeleteRoundedIcon fontSize="small" className="me-3" />
                  Delete comment
                </MenuItem>,
              ]}
              {!isYou && [
                <MenuItem
                  onClick={handleHideComment}
                  key={`hideComment-${comment.id}`}
                  className={classes.menuItem}
                >
                  <CancelPresentationRoundedIcon
                    fontSize="small"
                    className="me-3"
                  />
                  Hide comment
                </MenuItem>,
              ]}
            </MenuList>
          </Menu>
        </div>
        {comment.content}
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  menuWrapper: {
    marginTop: 40,
    marginLeft: 5,
    padding: 0,
  },
  menuList: {
    padding: 0,
  },
}));

const mapStateToProps = (state, ownProps) => {
  const author = ownProps.comment.author;

  return {
    authorData: state.users.list?.find((user) => user.id === author),
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps, {
  deleteComment,
  updateComment,
  hideComment,
})(CommentWrapper);
