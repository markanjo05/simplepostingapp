import React, { useEffect, useRef, useState } from "react";
import {
  Paper,
  TextField,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Container,
} from "@material-ui/core";
import { signUp, clearAuth } from "../../store/actions/authActions";
import { connect } from "react-redux";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import { DEFAULT_AVATAR_OPTIONS } from "src/config/constants";
import "./index.scss";

const Signup = (props) => {
  const { signUp, authError, loggedUser, isPosting, clearAuth } = props;

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      !!authError && clearAuth();
      isInitialLoad.current = false;
    }
  }, [authError, clearAuth]);

  const fileInputRef = useRef();
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preview, setPreview] = useState();
  const [selectedAvatarType, setSelectedAvatarType] = useState("");
  const isDisableSave =
    !username || !firstName || !lastName || !selectedAvatarType || !password;
  const isDisableReset =
    !username && !firstName && !lastName && !selectedAvatarType && !password;

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleSelectImage = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const avatarType = !!selectedAvatarType ? selectedAvatarType : "no_dp";

    let avatarImage = "";

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

    signUp({
      username: username.toLowerCase(),
      password,
      firstName,
      lastName,
      avatarType,
      avatarImage,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setSelectedAvatarType("");
    setImage(null);
    setPreview(null);
  };

  const handleChange = (e) => {
    e.preventDefault();
    clearAuth();

    const fieldName = e.target.name;
    const value = e.target.value;

    switch (fieldName) {
      case "username":
        // username
        setUsername(value);
        break;
      case "password":
        // password
        setPassword(value);
        break;
      case "firstName":
        // firstname
        setFirstName(value);
        break;
      case "photo":
        const file = e.target.files[0];

        if (file && file.type.substr(0, 5) === "image") {
          setImage(file);
          setSelectedAvatarType("uploadedPhoto");
        } else {
          setImage(null);
        }
        break;
      default:
        // lastname
        setLastName(value);
    }
  };

  const handleSelectAvatar = (avatarType) => {
    setSelectedAvatarType(avatarType);
  };

  return !!loggedUser?.username ? (
    <Redirect to="/dashboard" />
  ) : (
    <Container maxWidth="sm" className="signupContainer pt-3">
      <Paper className="p-3">
        <h2 className="mb-3">Sign up</h2>
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
              disabled={isPosting}
              inputProps={{ maxLength: 15 }}
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
              disabled={isPosting}
            />
          </div>
          <div className="sectionWrapper mb-3">
            <span className="d-block">
              First Name<span className="text-danger ms-1">*</span>
            </span>
            <TextField
              name="firstName"
              value={firstName}
              onChange={handleChange}
              fullWidth
              required
              disabled={isPosting}
              inputProps={{ maxLength: 10 }}
            />
          </div>
          <div className="sectionWrapper mb-3">
            <span className="d-block">
              Last Name<span className="text-danger ms-1">*</span>
            </span>
            <TextField
              name="lastName"
              value={lastName}
              onChange={handleChange}
              fullWidth
              required
              disabled={isPosting}
              inputProps={{ maxLength: 10 }}
            />
          </div>
          <span className="d-block mt-3 mb-2">
            Select Display Photo<span className="text-danger ms-1">*</span>
          </span>
          <div className="sectionWrapper imageSelectionWrapper">
            <IconButton
              onClick={handleSelectImage}
              disabled={isPosting}
              disableFocusRipple
              className="p-2 me-2"
            >
              <Avatar className="profileAvatar">
                <AddBoxRoundedIcon />
              </Avatar>
            </IconButton>
            {preview && (
              <IconButton
                id="uploadedPhoto"
                disableFocusRipple
                onClick={() => handleSelectAvatar("uploadedPhoto")}
                className={`${
                  selectedAvatarType === "uploadedPhoto" && "selectedAvatar"
                } p-2 me-2`}
                disabled={isPosting}
              >
                <Avatar
                  src={preview}
                  alt="profilePhoto"
                  className="profileAvatar"
                />
              </IconButton>
            )}
            {DEFAULT_AVATAR_OPTIONS.map((avatar) => {
              const { id, image } = avatar;

              const handleClickAvatarOption = () => {
                handleSelectAvatar(id);
              };

              return (
                <IconButton
                  key={id}
                  id={id}
                  disableFocusRipple
                  onClick={handleClickAvatarOption}
                  className={`${
                    selectedAvatarType === id && "selectedAvatar"
                  } p-2 me-2`}
                  disabled={isPosting}
                >
                  <Avatar src={image} alt={id} className="profileAvatar" />
                </IconButton>
              );
            })}
            <input
              name="photo"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="d-none"
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
              disabled={isPosting || isDisableSave}
              disableElevation
              disableFocusRipple
              disableRipple
              disableTouchRipple
            >
              {isPosting ? (
                <>
                  <CircularProgress
                    color="inherit"
                    size="20px"
                    className="me-2"
                  />
                  Creating Account
                </>
              ) : (
                "Sign up"
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

export default connect(mapStateToProps, { signUp, clearAuth })(Signup);
