import React, {  useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactImageAppear from 'react-image-appear';
import ReactTimeAgo from 'react-time-ago';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import userImage from '../../img/user-image.png';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, user, likes, date,imageData },
  
}) =>{
   const [like, setLike] = useState();
  const [timeago,setTimeAgo] = useState(false);
   useEffect(() => {
    
      let mounted = true;
      if(mounted){
         if(likes.filter((like) => like.user === auth.user._id).length > 0){
            setLike(true);
         }
         else{
            setLike(false);
         }
         setTimeAgo(true);
      }
      else
         setTimeAgo(false);

         return   function cleanup() {
               mounted = false;
           }  
    }, [likes,auth]);

 return (
  <div className="card">
   <div className="card-content">
      <div className="card-header user-profile-header">
         <div className="avatar mr-50 align-top">
            <img src={userImage} alt="" width="32" height="32" />
         </div>
         <div className="d-inline-block mt-25">
            <h6 className="mb-0 text-bold-500">{name}</h6>
            <p className="text-muted">{date && timeago &&<small><ReactTimeAgo date={Date.parse(date)} locale="en-US" timeStyle="round-minute"/></small>}</p>
         </div>
         {!auth.loading && user === auth.user._id && (
        <div className="btn-group dropleft">
         <i className=" cursor-pointer fa fa-ellipsis-v float-right " id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
         <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="cursor-pointer dropdown-item"  href="#!" onClick = {e => deletePost(_id)} >Delete</a>
         </div>
         </div>
         )}
      </div>
      <div className="card-body py-0">
        {text && (
         <p className="card-body-para">{text}
         </p>
        )}
         {imageData && (
         <ReactImageAppear src={imageData} alt="" className="img-fluid"/>
         )}
      </div>
     
      <div className="card-footer d-flex justify-content-between pt-1">
         <div className="d-flex align-items-center">
            <i className={'cursor-pointer user-profile font-medium-4 ' + (like ? 'fas fa-heart text-danger' : 'far fa-heart')} onClick={async (e) => {
            like ? await removeLike(_id) : await addLike(_id);
            setLike(!like);
          }}></i>
            <p className="mb-0 ml-25">{likes.length>0 && likes.length +'Likes'}</p>
         </div>
      </div>
 
   </div>
</div>
);
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost}
)(PostItem);