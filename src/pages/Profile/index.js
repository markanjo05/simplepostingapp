import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { Container, Paper, CircularProgress } from "@material-ui/core";
import { useParams } from "react-router-dom";
import PostDialog from "src/components/PostDialog";
import { getPosts, createPost } from "src/store/actions/postsActions";
import { getUser, getUsers } from "src/store/actions/usersActions";
import UpdateProfileDialog from "./UpdateProfileDialog";
import PostList from "src/components/PostList";
import { UserAvatar } from "src/components";
import "./index.scss";

const Profile = (props) => {
  const {
    // from mapdispatch
    createPost,
    getUser,
    getUsers,
    getPosts,
    // from mapstate
    loggedUser,
    viewedProfile = {},
    posts = [],
    totalPosts,
    isPosting,
  } = props;

  const { id } = useParams();

  const [offset, setOffset] = useState(0);
  const hasMore = offset + 10 < totalPosts;

  const handleFetchMore = () => {
    if (hasMore) {
      setTimeout(() => {
        setOffset((prev) => prev + 10);
      }, 3000);
    }
  };

  useEffect(() => {
    getPosts({ author: id, offset });
  }, [getPosts, id, offset]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getUser(id);
  }, [getUser, id]);

  useEffect(() => {
    getUser(id);
  }, [getUser, id]);

  const isInitialLoad = useRef(true);
  const isNotExistingUser = !isPosting && !viewedProfile?.username;

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, []);

  const handleCreateNewPost = ({ content }) => {
    createPost({
      content,
    });
  };

  return !loggedUser ? (
    <Redirect to="/login" />
  ) : !isInitialLoad.current && isNotExistingUser ? (
    <Redirect to="/nouser" />
  ) : !viewedProfile?.id ? (
    <div className="d-flex justify-content-center p-3">
      <CircularProgress />
    </div>
  ) : (
    <div className="coverSectionWrapper pt-1 pb-3">
      <Container maxWidth="sm">
        <div className="mb-3">
          <Paper className="mt-3">
            <div className="d-flex flex-column pt-3 pb-3">
              <UserAvatar
                alt="avatar"
                src={viewedProfile?.avatar}
                className="profilePageAvatar m-auto"
              />
              <span className="profilePageName d-block ms-auto me-auto">{`${
                viewedProfile?.firstName || ""
              } ${viewedProfile?.lastName || ""}`}</span>
              {!!viewedProfile?.username && (
                <span className="profilePageEmail d-block ms-auto me-auto">{`${`@${viewedProfile?.username}`}`}</span>
              )}
              {id === loggedUser?.id && <UpdateProfileDialog />}
            </div>
          </Paper>
          {viewedProfile.id === loggedUser?.id && (
            <Paper className="p-3 mt-3">
              <div className="d-flex align-items-center">
                <UserAvatar
                  src={viewedProfile?.avatar}
                  alt={viewedProfile?.initials}
                />
                <PostDialog
                  profile={viewedProfile}
                  submitAction={handleCreateNewPost}
                  isNewPost={true}
                />
              </div>
            </Paper>
          )}
        </div>
        <hr />
        <PostList
          isInitialLoad={isPosting && !offset}
          posts={posts}
          handleFetchMore={handleFetchMore}
          hasMore={hasMore}
          noPostsText={`${viewedProfile.firstName} has no posts yet.`}
        />
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    viewedProfile: state.users.profile,
    loggedUser: state.auth.loggedUser,
    posts: state.posts.list,
    isPosting: state.posts.isPosting,
    totalPosts: state.posts.total,
  };
};

export default connect(mapStateToProps, {
  getPosts,
  getUser,
  getUsers,
  createPost,
})(Profile);
