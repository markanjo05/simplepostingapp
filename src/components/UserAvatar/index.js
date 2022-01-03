import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import noAvatar from "src/images/avatar_user.png";

const UserAvatar = (props) => {
  const { className, src, alt } = props;
  const [isImgLoading, setIsImgLoading] = useState(!!src);

  return (
    <>
      <img
        alt="imgLoader"
        className="d-none"
        src={src}
        onLoad={() => setIsImgLoading(false)}
      />
      <Avatar
        className={className || ""}
        src={!!src ? (isImgLoading ? noAvatar : src) : noAvatar}
        alt={alt}
      />
    </>
  );
};

export default UserAvatar;
