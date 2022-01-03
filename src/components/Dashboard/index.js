import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Container, makeStyles, Paper } from "@material-ui/core";
import { getPosts, createPost } from "src/store/actions/postsActions";
import { Redirect } from "react-router";
import { PostDialog, PostList, UserAvatar } from "src/components";

const Dashboard = (props) => {
  const {
    // from mapstate
    posts = [],
    totalPosts,
    isPosting,
    loggedUser,
    // from mapdispatch
    getPosts,
    createPost,
  } = props;

  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const hasMore = offset + 10 < totalPosts;
  const isInitialLoad = useRef(true);

  const handleFetchMore = () => {
    if (hasMore) {
      setTimeout(() => {
        setOffset((prev) => prev + 10);
      }, 3000);
    }
  };

  useEffect(() => {
    getPosts({ offset });
  }, [getPosts, offset]);

  useEffect(() => {
    if (isPosting && isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [isPosting]);

  return !loggedUser ? (
    <Redirect to="/login" />
  ) : (
    <div className={`${classes.root} pt-3 pb-3`}>
      <Container maxWidth="sm">
        <Paper className="p-3">
          <div className="d-flex align-items-center">
            <UserAvatar src={loggedUser?.avatar} alt={loggedUser?.initials} />
            <PostDialog
              profile={loggedUser}
              submitAction={createPost}
              isNewPost={true}
            />
          </div>
        </Paper>
        <hr />
        <PostList
          isInitialLoad={isInitialLoad.current && isPosting}
          posts={posts}
          handleFetchMore={handleFetchMore}
          hasMore={hasMore}
          noPostsText={"There are no posts yet. Start posting!"}
        />
      </Container>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#f3f3f3",
  },
}));

const mapStateToProps = (state) => {
  return {
    posts: state.posts.list,
    isPosting: state.posts.isPosting,
    totalPosts: state.posts.total,
    loggedUser: state.auth.loggedUser,
  };
};

export default connect(mapStateToProps, {
  getPosts,
  createPost,
})(Dashboard);
