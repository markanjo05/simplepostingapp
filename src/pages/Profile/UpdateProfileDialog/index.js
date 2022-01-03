import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  CircularProgress,
  DialogActions,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { updateProfile } from "src/store/actions/usersActions";
import CloseIcon from "@material-ui/icons/Close";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import { Alert } from "@material-ui/lab";
import noAvatar from "src/images/avatar_user.png";
import { DEFAULT_AVATAR_OPTIONS } from "src/config/constants";
import "./index.scss";

const UpdateProfileDialog = (props) => {
  const {
    // from mapdispatch
    updateProfile,
    // from mapstate
    isPosting,
    viewedProfile = {},
  } = props;
  const fileInputRef = useRef();
  const [firstName, setFirstName] = useState(viewedProfile?.firstName || "");
  const [lastName, setLastName] = useState(viewedProfile?.lastName || "");
  const [selectedAvatarType, setSelectedAvatartType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);

  const handleSelectImage = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleSelectAvatar = (avatarType) => {
    setSelectedAvatartType(avatarType);
    setImage(null);
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleToggleDialog = () => {
    setIsOpen(!isOpen);
    handleResetValues();
  };

  const handleResetValues = () => {
    setIsUpdated(false);
    setFirstName(viewedProfile?.firstName || "");
    setLastName(viewedProfile?.lastName || "");
    setImage(null);
    setPreview(null);
    setSelectedAvatartType("");
  };

  useEffect(() => {
    setIsShowAlert(!isPosting && isUpdated);
  }, [isPosting, isUpdated]);

  const handleResetForm = (e) => {
    e.preventDefault();

    setIsUpdated(false);
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setIsShowAlert(false);

    const fieldName = e.target.name;
    const value = e.target.value;

    switch (fieldName) {
      case "firstName":
        // firstname
        setFirstName(value);
        break;
      case "photo":
        const file = e.target.files[0];

        if (file && file.type.substr(0, 5) === "image") {
          setImage(file);
          setSelectedAvatartType("uploadedPhoto");
        } else {
          setImage(null);
        }
        break;
      default:
        // lastname
        setLastName(value);
    }
  };

  const getSelectedAvatar = () => {
    let avatarImage = "";

    if (selectedAvatarType === "uploadedPhoto" && !!image) {
      avatarImage = image;
    } else if (selectedAvatarType === "no_dp") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[0].image;
    } else if (selectedAvatarType === "boy01") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[1].image;
    } else if (selectedAvatarType === "boy02") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[2].image;
    } else if (selectedAvatarType === "girl01") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[3].image;
    } else if (selectedAvatarType === "girl02") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[4].image;
    }

    return avatarImage;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const avatarType = !!selectedAvatarType ? selectedAvatarType : "";

    let avatarImage = viewedProfile.avatar;

    if (avatarType === "uploadedPhoto" && !!image) {
      avatarImage = image;
    } else if (avatarType === "no_dp") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[0].firebaseImgSrc;
    } else if (avatarType === "boy01") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[1].firebaseImgSrc;
    } else if (avatarType === "boy02") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[2].firebaseImgSrc;
    } else if (avatarType === "girl01") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[3].firebaseImgSrc;
    } else if (avatarType === "girl02") {
      avatarImage = DEFAULT_AVATAR_OPTIONS[4].firebaseImgSrc;
    }

    updateProfile({ firstName, lastName, avatarType, avatarImage });

    setIsUpdated(true);
    // setIsOpen(!isOpen);
  };

  return (
    <div className="updateProfileDialogWrapper">
      <div className="editProfileBtn d-flex justify-content-center mt-3">
        <Button
          variant="contained"
          color="inherit"
          startIcon={<EditIcon />}
          disableElevation
          disableFocusRipple
          disableRipple
          disableTouchRipple
          className="editProfileBtn"
          onClick={handleToggleDialog}
        >
          Edit Profile
        </Button>
      </div>
      <Dialog
        onClose={handleResetForm}
        open={isOpen}
        maxWidth="xs"
        fullWidth
        className="updateProfileDialog"
      >
        <DialogTitle className="pt-2 pb-2 ps-3 pe-1">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <span className="fw-bold">Update Profile</span>
            <IconButton onClick={handleResetForm}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers className="pe-3 ps-3">
          <div className="d-flex flex-column align-items-center mb-3">
            <div className="w-100">
              <span className="d-block mb-2 selectPhotoLabel">
                Select Display Photo *
              </span>
              <Avatar
                src={
                  !!preview
                    ? preview
                    : !selectedAvatarType
                    ? viewedProfile.avatar || noAvatar
                    : getSelectedAvatar()
                }
                alt=" "
                className="selectedProfilePhoto me-auto ms-auto mb-3"
              />
              <div className="avatarOptionsContainer">
                <IconButton
                  onClick={handleSelectImage}
                  disabled={isPosting}
                  className="p-2 me-1"
                >
                  <Avatar className="editProfileAvatar">
                    <AddBoxRoundedIcon />
                  </Avatar>
                </IconButton>
                {DEFAULT_AVATAR_OPTIONS.map((avatar) => {
                  const { id, image } = avatar;

                  const handleClickAvatarOption = () => {
                    setIsShowAlert(false);
                    handleSelectAvatar(id);
                  };

                  return (
                    <IconButton
                      key={id}
                      id={id}
                      onClick={handleClickAvatarOption}
                      className={`${
                        selectedAvatarType === id && "selectedAvatar"
                      } p-2 me-1`}
                      disabled={isPosting}
                    >
                      <Avatar
                        src={image}
                        alt={id}
                        className="editProfileAvatar"
                      />
                    </IconButton>
                  );
                })}
              </div>
              <input
                name="photo"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="d-none"
              />
            </div>
            <TextField
              name="firstName"
              label="First Name"
              value={firstName}
              onChange={handleChange}
              className="mt-2 mb-2"
              fullWidth
              required
              autoComplete="off"
              disabled={isPosting}
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={lastName}
              onChange={handleChange}
              className="mt-2 mb-2"
              fullWidth
              required
              autoComplete="off"
              disabled={isPosting}
              inputProps={{ maxLength: 10 }}
            />
          </div>
          {isShowAlert && (
            <Alert
              onClose={() => setIsShowAlert(!isShowAlert)}
              severity="success"
              variant="filled"
              className="mt-3"
            >
              Updated successfuly!
            </Alert>
          )}
        </DialogContent>
        <DialogActions className="pe-3 ps-3">
          <Button
            variant="contained"
            color="inherit"
            disabled={isPosting}
            onClick={handleResetValues}
            fullWidth
            disableElevation
            className="submitPostButton w-100"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isPosting}
            onClick={handleSubmitForm}
            fullWidth
            disableElevation
            className="submitPostButton w-100"
          >
            {isPosting ? (
              <>
                <CircularProgress
                  color="inherit"
                  size="20px"
                  className="me-2"
                />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    viewedProfile: state.users.profile,
    isPosting: state.users.profile?.isPosting || false,
  };
};

export default connect(mapStateToProps, {
  updateProfile,
})(UpdateProfileDialog);
