import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';
import { setAlert } from '../../actions/alert';
import {toast} from 'react-toastify';  
import "react-toastify/dist/ReactToastify.css";
import Spinner from '../layouts/Spinner';
import userImage from '../../img/user-image.png';


const PostForm = ({ addPost,loading,auth }) => {
  const [text, setText,charLimit=120] = useState('');
  const [postImage, setPostImage] = useState('');
  const [imagetype,setImageType] = useState('');
  const [validImage, setValidImage] = useState(false);
  const [load,setLoad] = useState();
  const [refresh,setRefresh] = useState(loading);

  toast.configure() ;
  useEffect(() => {
   const timer = setTimeout(() => {
     setLoad('none');
   }, 3000);
   setLoad('block');

   return () => clearTimeout(timer);
 }, [postImage]);


 const enabled = text.length >0 || validImage;

   const imageHandler = e  =>{
      const imageFile = e.target.files[0];
      if(imageFile!== undefined){
       if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
         toast.error('Invalid Image', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            progress: undefined,
            });
         setValidImage(false);
         e.target.value = null;
         return false;
       }
   
   setImageType(imageFile);
   const reader = new FileReader();
   setValidImage(true);
   reader.onload = () =>{

       if(reader.readyState ===2){
           setPostImage(reader.result);
       }
   }
   reader.readAsDataURL(imageFile);
   e.target.value = null;
}
   }
   const imageRemover = (data,e) =>{
      setPostImage(null);
      setValidImage(false);
      setImageType(null);
         return false;
   }
  return (
     
    <div className="raf-panel raf-panel--rounded">
   <form className="form2"
    onSubmit={e => {
      e.preventDefault();
     setRefresh(true);
      addPost({ text,imagetype,auth }).then(results => {
         setRefresh(false);
         setValidImage(false);
      })
      setText(''); 
      setImageType('');
     }}
     >
    {refresh && <Spinner/>}
      <div className="rfu-dropzone" aria-disabled="false" style={{position: 'relative'}}>
         <div className="raf-panel-header">
         <div className="avatar mr-50 align-top">
            <img src={userImage} alt="" width="32" height="32" />
         </div>
           { auth.user && <div className="raf-title" style={{fontSize: 15}}>{auth.user.name}</div> }  
         </div>
         
         {validImage &&(
            <div className="rfu-image-previewer">
            <div className="rfu-image-previewer__image rfu-image-previewer__image--loaded">
            
               <div className="rfu-thumbnail__wrapper" style={{width: 200, height: 200}}>
                  <div className="rfu-thumbnail__overlay">

                     <div className="rfu-icon-button" role="button">
                        <div>
                        <i className="fa fa-times" onClick={e=>imageRemover(postImage,e)}></i>
                        </div>
                     </div>
                  </div>
                  {load === 'none'?
                  <img
                   src={postImage} className="rfu-thumbnail__image" alt=""/>
                  :<Spinner/>
                  }
               </div>
            </div>
         </div>
         )}
         
         <div className="raf-panel-content">
            <div style={{display: 'flex'}}>
               <div className="rta  raf-textarea">
                 <textarea rows="3" name='text' maxLength={charLimit} placeholder="Hey! Try Something here." className="rta__textarea raf-textarea__textarea"
                 value={text}
                 onChange={e => setText(e.target.value)}
                 ></textarea>
                 <span className="countChar">{text.length+'/'+charLimit}</span>
                 </div>
            </div>
         </div>
         <br/>
         <div className="raf-panel-footer">
            <div style={{display: 'flex', alignItems: 'center'}}>
               <div style={{flex: '1 1 0%'}}>
                  
                  <label htmlFor="file-upload" className="imagebtn"><i className="fa fa-image" />Add</label>
                  <input type="file" id ="file-upload" accept="image/*" onChange={e=>imageHandler(e)} /> 
                  
               </div>
               <button className="imagebtn" id ="postSubmit"type="submit" disabled={!enabled}>Post</button>
            </div>
         </div>
      </div>
   </form>
</div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  setAlert : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
   loading: state.post.loading,
   auth: state.auth,
 });
 
export default connect(
   mapStateToProps,
  { addPost,setAlert }
)(PostForm);