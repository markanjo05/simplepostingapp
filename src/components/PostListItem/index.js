import React, { useState } from "react";
import moment from "moment";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CancelPresentationRoundedIcon from "@material-ui/icons/CancelPresentationRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { PostDialog, CommentsBox, UserAvatar } from "src/components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  hideComment,
  hidePost,
  likePost,
  seeLikers,
  updateComment,
  updatePost,
} from "src/store/actions/postsActions";
import "./index.scss";

function PostListItem(props) {
  const {
    // from passed props
    postItem,
    profile,
    // from mapstatetoprops
    authorData,
    loggedUser,
    // from mapdispatchtoprops
    updatePost,
    deletePost,
    hidePost,
  } = props;

  const classes = useStyles();
  const isYou = loggedUser?.id === postItem.author;
  const [anchorEl, setAnchorEl] = useState(null);
  const [isImgLoading, setIsImgLoading] = useState(!!postItem.image);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    deletePost(postItem.id);
    handleClose();
  };

  const handleHidePost = () => {
    hidePost(postItem.id);
    handleClose();
  };

  const handleOnUpdate = ({ content, image }) => {
    updatePost({
      id: postItem.id,
      content: content,
      image: image,
    });
  };

  return (
    <Card className="postListItemWrapper mb-3">
      <CardHeader
        avatar={
          <Link to={`/profile/${postItem.author}`}>
            <UserAvatar src={authorData?.avatar} alt={authorData?.initials} />
          </Link>
        }
        action={
          <IconButton
            onClick={handleClick}
            id={`${postItem.id}|${postItem.author}`}
          >
            <MoreHorizIcon />
          </IconButton>
        }
        title={
          <Link to={`/profile/${postItem.author}`} className="postAuthorLink">
            {`${authorData?.firstName} ${authorData?.lastName}`}
            {isYou && " (You)"}
          </Link>
        }
        subheader={`${moment(postItem.createdAt).fromNow(true)} ago`}
      />
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
          {postItem.author === loggedUser?.id ? (
            [
              <PostDialog
                key={`editPost-${postItem.id}`}
                profile={profile}
                submitAction={handleOnUpdate}
                content={postItem.content}
                postImage={!!postItem.image ? postItem.image : ""}
                dialogHeaderLabel="Edit post"
                actionComponent={
                  <MenuItem
                    key={`editPost-${postItem.id}`}
                    onClick={handleClose}
                    className={classes.menuItem}
                  >
                    <EditRoundedIcon fontSize="small" className="me-3" />
                    Edit post
                  </MenuItem>
                }
                isNewPost={false}
              />,
              <MenuItem
                key={`deletePost-${postItem.id}`}
                onClick={handleDeletePost}
                className={classes.menuItem}
              >
                <DeleteRoundedIcon fontSize="small" className="me-3" />
                Delete post
              </MenuItem>,
            ]
          ) : (
            <MenuItem onClick={handleHidePost} className={classes.menuItem}>
              <CancelPresentationRoundedIcon
                fontSize="small"
                className="me-3"
              />
              Hide post
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <CardContent className="pt-0">
        <span>{postItem.content}</span>
      </CardContent>
      {/* just for initially loading image  */}
      <img
        alt="postImage"
        className="d-none"
        src={postItem.image}
        onLoad={() => setIsImgLoading(false)}
      />
      {!!postItem.image && (
        <>
          {isImgLoading ? (
            <div className="d-flex flex-column pt-5 pb-5 bg-light">
              <CircularProgress className="align-self-center mb-2" />
              <span className="align-self-center">Image loading</span>
            </div>
          ) : (
            <img
              alt="postImage"
              className="w-100"
              src={postItem.image}
              loading="eager"
            />
          )}
        </>
      )}
      <CommentsBox postItem={postItem} />
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  menuWrapper: {
    marginTop: 50,
    marginLeft: 10,
    padding: 0,
  },
  menuList: {
    padding: 0,
  },
}));

const mapStateToProps = (state, ownProps) => {
  const author = ownProps.postItem.author;

  return {
    authorData: state.users.list?.find((user) => user.id === author),
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps, {
  createPost,
  updatePost,
  deletePost,
  hidePost,
  likePost,
  addComment,
  seeLikers,
  deleteComment,
  updateComment,
  hideComment,
})(PostListItem);
