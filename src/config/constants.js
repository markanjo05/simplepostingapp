import avatar_user from "src/images/avatar_user.png";
import avatar_boy_01 from "src/images/avatar_boy_01.png";
import avatar_boy_02 from "src/images/avatar_boy_02.png";
import avatar_girl_01 from "src/images/avatar_girl_01.png";
import avatar_girl_02 from "src/images/avatar_girl_02.png";

// NOTE:
// Update "firebaseImgSrc" value to your own firebase storage link
export const DEFAULT_AVATAR_OPTIONS = [
  {
    id: "no_dp",
    image: avatar_user,
    firebaseImgSrc:
      "https://firebasestorage.googleapis.com/v0/b/planscreator-269db.appspot.com/o/profilePhotos%2Fdefaults%2Favatar_user.png?alt=media&token=449ba194-efbf-4e80-a85e-96dad4c70a82",
  },
  {
    id: "boy01",
    image: avatar_boy_01,
    firebaseImgSrc:
      "https://firebasestorage.googleapis.com/v0/b/planscreator-269db.appspot.com/o/profilePhotos%2Fdefaults%2Favatar_boy_01.png?alt=media&token=1e22c1b2-572b-4280-b834-9cd76f14455d",
  },
  {
    id: "boy02",
    image: avatar_boy_02,
    firebaseImgSrc:
      "https://firebasestorage.googleapis.com/v0/b/planscreator-269db.appspot.com/o/profilePhotos%2Fdefaults%2Favatar_boy_02.png?alt=media&token=adb89644-726a-4512-9d91-5d71dad7751f",
  },
  {
    id: "girl01",
    image: avatar_girl_01,
    firebaseImgSrc:
      "https://firebasestorage.googleapis.com/v0/b/planscreator-269db.appspot.com/o/profilePhotos%2Fdefaults%2Favatar_girl_01.png?alt=media&token=ee0e2d84-3e48-408a-b9df-adf4b37dfa06",
  },
  {
    id: "girl02",
    image: avatar_girl_02,
    firebaseImgSrc:
      "https://firebasestorage.googleapis.com/v0/b/planscreator-269db.appspot.com/o/profilePhotos%2Fdefaults%2Favatar_girl_02.png?alt=media&token=6d1c3a7c-6ffb-4ef0-94f7-735da17f0c98",
  },
];
