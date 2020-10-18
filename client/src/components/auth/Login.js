import React, { Fragment,useState } from 'react'
import { Link,Redirect } from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        username:'',
        password:'',
    });
    const {username, password} = formData;
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = e => {
        e.preventDefault();
        login(username,password);
    }

    if (isAuthenticated) {
        return <Redirect to="/posts" />;
      }
    return <Fragment>
      <div className = "row">
            <div className="col-lg-3">
              </div>
            <div className="col-lg-6">
        <h1 className="large text-primary">Sign In</h1>
      <form className="form" onSubmit={e => onSubmit(e)}>
        
        <div className="form-group">
          <input type="text" placeholder="Username" name="username" value={username} onChange={e => onChange(e)} required/>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} 
            onChange={e => onChange(e)}
            required
      
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Not yet Registered? <Link to="/register">Sign Up</Link>
      </p>
      </div>
      </div>
    </Fragment>
}
Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });
export default connect(mapStateToProps,{login})(Login);