import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Paper, Typography } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import PostListItem from "../PostListItem";

const PostList = (props) => {
  const {
    // from passed props
    isInitialLoad,
    posts,
    handleFetchMore,
    hasMore,
    noPostsText,
    // from mapstate
    users,
    isPosting,
    totalPosts,
  } = props;

  return (
    <>
      {isInitialLoad ? (
        <div className="d-flex justify-content-center pb-3">
          <CircularProgress />
        </div>
      ) : posts.length > 0 ? (
        <>
          <InfiniteScroll
            className="overflow-hidden"
            dataLength={posts.length}
            next={handleFetchMore}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center">
                <CircularProgress />
              </div>
            }
          >
            {posts.map((post, idx) => {
              // don't display if author is not existing in database
              const authorProfile = users.find(
                (user) => user.id === post.author
              );

              return (
                <>
                  {!!authorProfile && (
                    <PostListItem
                      key={post.id}
                      postItem={post}
                      profile={authorProfile}
                    />
                  )}
                </>
              );
            })}
          </InfiniteScroll>
          {totalPosts <= posts.length && (
            <>
              <hr className="m-1" />
              <Typography
                variant="overline"
                display="block"
                className="text-center fw-bold text-secondary"
              >
                ALL POSTS LOADED
              </Typography>
              <hr className="m-1" />
            </>
          )}
        </>
      ) : isPosting ? (
        <div className="d-flex justify-content-center pt-2 pb-3">
          <CircularProgress />
        </div>
      ) : (
        <Paper className="p-3 mt-3 text-center text-secondary">
          {noPostsText}
        </Paper>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users.list,
    isPosting: state.posts.isPosting,
    totalPosts: state.posts.total,
  };
};

export default connect(mapStateToProps)(PostList);
