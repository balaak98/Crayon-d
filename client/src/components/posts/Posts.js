import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({ getPosts, post: { posts ,loading} }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
        loading ? <Spinner/>:
        <div className = "row">
          <div className="col-lg-3">
          </div>

        <div className="col-lg-6">
         <Fragment>
        <PostForm/>
        <hr/>

        {posts.length>0 ? posts.map((post) => (
          <PostItem key={post._id} post={post} 
          />
        )) : <div>
         <p className="no-info">Sorry! No posts available</p>
        </div> }
        </Fragment>
        </div>
        </div>

  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);