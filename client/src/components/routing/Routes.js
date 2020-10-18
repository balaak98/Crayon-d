import React from 'react'
import {Route, Switch} from 'react-router-dom';
import  Register  from '../auth/Register';
import  Login  from '../auth/Login';
import Alert from '../layouts/Alert';
import Posts from '../posts/Posts';
import PrivateRoute from '../routing/PrivateRoute';
import NotFound from '../layouts/NotFound';
export const Routes = () => {
    return (
        <section className="container">
        <div id="toast-container" className="toast-container toast-top-right">
          <Alert/>
        </div>
        <Switch>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={Login}/>
        <PrivateRoute exact path='/posts' component={Posts}/>
        <Route component = {NotFound} />
        </Switch>
      </section>
    )
}
