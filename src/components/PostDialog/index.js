import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useRef, useState } from "react";
import ImageIcon from "@material-ui/icons/Image";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { grey } from "@material-ui/core/colors";
import { UserAvatar } from "..";

function PostDialog(props) {
  const {
    // from passed props
    content = "",
    postImage = "",
    submitAction,
    actionComponent,
    dialogHeaderLabel = "Add post",
    isNewPost,
    hasImage = true,
    // from mapstate
    isPosting,
    loggedUser,
  } = props;

  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const fileInputRef = useRef();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(postImage);

  const handleSelectImage = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleToggleDialog = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      setNewContent(content);
      setImage(null);
      setPreview(postImage || "");
    }
  };

  const handleChangeContent = (e) => {
    setNewContent(e.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!!image) {
      submitAction({ content: newContent, image: image });
      setTimeout(() => {
        handleToggleDialog();
      }, 4000);
    } else {
      if (!!preview) {
        submitAction({
          content: newContent,
        });
      } else {
        submitAction({
          content: newContent,
          image: null,
        });
      }
      handleToggleDialog();
    }
  };

  const handleResetForm = (e) => {
    e.preventDefault();
    handleToggleDialog();
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const handleRemovePhoto = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="postDialogWrapper w-100">
      {!!actionComponent ? (
        <div onClick={handleToggleDialog}>{actionComponent}</div>
      ) : (
        <Button
          onClick={handleToggleDialog}
          variant="contained"
          className={`${classes.addPostButton} justify-content-start ms-2`}
          fullWidth
          disableElevation
          disableFocusRipple
          disableRipple
          disableTouchRipple
        >
          {`Hi ${loggedUser?.firstName}, post something!`}
        </Button>
      )}
      <Dialog
        onClose={handleToggleDialog}
        open={isOpen}
        maxWidth="sm"
        fullWidth
        disableBackdropClick={isPosting}
        className="postDialog"
      >
        <DialogTitle className="pt-2 pb-2 ps-3 pe-1">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <span className="fw-bold">{dialogHeaderLabel}</span>
            <IconButton disabled={isPosting} onClick={handleResetForm}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers className="ps-3 pe-3">
          <div className="d-flex align-items-center mb-3 justify-content-between">
            <div className="d-flex align-items-center">
              <UserAvatar src={loggedUser?.avatar} alt={loggedUser?.initials} />
              <span className="fw-bold ms-2">
                {loggedUser?.firstName} {loggedUser?.lastName}
              </span>
            </div>

            {!!hasImage && (
              <>
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<ImageIcon />}
                  disabled={isPosting}
                  disableElevation
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  size="small"
                  onClick={handleSelectImage}
                  className={classes.addImageButton}
                >
                  {!!preview ? "Edit Image" : "Add Image"}
                </Button>
                <input
                  name="photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddPhoto}
                  className="d-none"
                />
              </>
            )}
          </div>
          <TextField
            id="content"
            placeholder={`Hi ${loggedUser?.firstName}, post something!`}
            onChange={handleChangeContent}
            rows="3"
            value={newContent}
            multiline
            InputProps={{ disableUnderline: true, maxLength: 30 }}
            fullWidth
            autoFocus
            disabled={isPosting}
          />
          {!!preview && (
            <div className="position-relative">
              <img alt="postimg" className="w-100" src={preview} />
              {!isPosting && (
                <IconButton
                  className={classes.deleteImageBtn}
                  onClick={handleRemovePhoto}
                >
                  <CancelIcon
                    className={`${classes.deleteImageIcon} text-white`}
                  />
                </IconButton>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-3">
          <Button
            variant="contained"
            color="primary"
            disabled={
              (newContent === content && preview === postImage) || isPosting
            }
            fullWidth
            disableElevation
            className={classes.submitPostButton}
            onClick={handleSubmitForm}
          >
            {isPosting ? (
              <>
                <CircularProgress
                  color="inherit"
                  size="20px"
                  className="me-2"
                />
                {isNewPost ? "Posting" : "Updating"}
              </>
            ) : isNewPost ? (
              "Post"
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  addPostButton: {
    borderRadius: 50,
    textTransform: "none",
    color: grey[600],
  },
  submitPostButton: {
    borderRadius: 50,
    textTransform: "none",
  },
  addImageButton: {
    borderRadius: 50,
    textTransform: "none",
  },
  deleteImageBtn: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  deleteImageIcon: {
    width: 30,
    height: 30,
  },
}));

const mapStateToProps = (state) => {
  return {
    isPosting: state.posts?.isPosting || false,
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps)(PostDialog);
