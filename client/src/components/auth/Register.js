import React, { Fragment,useState } from 'react';
import { Link,Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';

import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name:'',
        username:'',
        password:'',
        password2:''
    });
    const {name, username, password, password2} = formData;
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('Passwords do not match','error');
        }

        else{
            register({name,username,password});
        }
    }

    if (isAuthenticated) {
        return <Redirect to="/posts" />;
      }
    return <Fragment>
      <div className = "row">
            <div className="col-lg-3">
              </div>

      <div className="col-lg-6">
        <h1 className="large text-primary">Sign Up</h1>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} pattern="[A-Za-z ]+" title="Only characters allowed" minLength='3' required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Username" name="username" value={username} onChange={e => onChange(e)} required minLength='3'/>

        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="5"
            value={password} 
            onChange={e => onChange(e)}
            required
      
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="5"
            value={password2} 
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
      </div>
      </div>
    </Fragment>
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool

  };
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });
export default connect(mapStateToProps,{setAlert, register})(Register);