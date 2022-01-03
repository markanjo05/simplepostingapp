import React, { useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import MessageRoundedIcon from "@material-ui/icons/MessageRounded";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import SendIcon from "@material-ui/icons/Send";
import { CommentWrapper, LikesDialog, UserAvatar } from "src/components";
import {
  Accordion,
  AccordionDetails,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import {
  addComment,
  likePost,
  seeLikers,
} from "src/store/actions/postsActions";
import "./index.scss";

function CommentsBox(props) {
  const {
    // from passed props
    postItem = {},
    // from mapdispatch
    likePost,
    seeLikers,
    addComment,
    // from mapstate
    loggedUser,
  } = props;

  const isLiked = !!postItem.likes?.includes(loggedUser?.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");

  const [isLikeDialogOpen, setIsLikeDialogOpen] = useState(false);
  const handleToggleLikeDialog = () => {
    setIsLikeDialogOpen(!isLikeDialogOpen);
  };

  const handleExpandCommentSection = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = () => {
    addComment({
      postId: postItem.id,
      comment: comment,
    });

    setComment("");
  };

  const handleClickLikers = () => {
    seeLikers(postItem.likes);
    handleToggleLikeDialog();
  };

  const handleLikePost = (e) => {
    likePost({
      postId: postItem.id,
      isLiked: e.target.checked,
    });
  };

  return (
    <div className="commentBoxWrapper">
      <Accordion expanded={isExpanded}>
        <div className="d-flex justify-content-between p-2">
          <div className="d-flex align-items-center">
            <Checkbox
              icon={<ThumbUpAltOutlinedIcon />}
              checkedIcon={<ThumbUpAltIcon />}
              name="liked"
              color="primary"
              onChange={handleLikePost}
              checked={isLiked}
            />
            <IconButton
              onClick={handleExpandCommentSection}
              color={isExpanded ? "primary" : "default"}
            >
              {isExpanded ? (
                <MessageRoundedIcon />
              ) : (
                <ChatBubbleOutlineOutlinedIcon />
              )}
            </IconButton>
          </div>
          <div className="d-flex align-items-center">
            <Button
              size="small"
              color="primary"
              className="linkButton align-items-center"
              onClick={handleClickLikers}
              disabled={!postItem.likes || postItem.likes?.length === 0}
            >
              {postItem.likes?.length || 0} likes
            </Button>
            ・
            <Button
              size="small"
              color="primary"
              className="linkButton align-items-center"
              onClick={handleExpandCommentSection}
              disabled={!postItem.comments || postItem.comments?.length === 0}
            >
              {postItem.comments?.length || 0} comments
            </Button>
          </div>
          <LikesDialog
            handleToggleLikeDialog={handleToggleLikeDialog}
            isOpen={isLikeDialogOpen}
          />
        </div>
        <AccordionDetails className="d-block">
          <div className="d-flex align-items-center w-100">
            <UserAvatar
              className="commentAvatar"
              src={loggedUser?.avatar}
              alt={loggedUser?.initials}
            />
            <TextField
              className="addCommentField ms-2"
              value={comment}
              onChange={handleCommentChange}
              fullWidth
              placeholder="Add comment..."
              InputProps={{
                maxLength: 30,
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={comment === ""}
                      onClick={handleSubmitComment}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {postItem.comments
            ?.sort((a, b) =>
              moment(a.createdAt).isBefore(b.createdAt) ? -1 : 1
            )
            ?.map((comment) => {
              const isHidden = comment.hiddenFrom?.find(
                (hider) => hider === loggedUser?.id
              );

              return (
                !isHidden && (
                  <CommentWrapper
                    key={comment.id}
                    post={postItem}
                    comment={comment}
                  />
                )
              );
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps, {
  likePost,
  seeLikers,
  addComment,
})(CommentsBox);
