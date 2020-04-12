import React, {Component} from 'react';
import {IoIosLogIn, IoIosHome, IoIosFolder} from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import './Footer.css';

export default class Footer extends Component{
  constructor(){
    super();
    this.state = {
      counter:0
    }
    this.counterUpdate = this.counterUpdate.bind(this);
    this.logoutOnClick = this.logoutOnClick.bind(this);
  }
  counterUpdate(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({counter:this.state.counter+1});
  }
  logoutOnClick(e){
    e.preventDefault();
    e.stopPropagation();
    this.props.auth.logout();
  }
  render(){
    if (this.props.hide && true){
      return null;
    }
    if (this.props.auth && this.props.auth.isLogged && true){
      return (
        <footer>
          <nav>
            <ul>
              <li><NavLink to="/"><IoIosHome/>Home</NavLink></li>
              <li><NavLink to="/servicios"><IoIosFolder/>Productos</NavLink></li>
              <li><NavLink to="/signin"><IoIosLogIn /> Orders</NavLink></li>
              <li><a onClick={this.logoutOnClick}><IoIosLogIn /> Logout</a></li>
            </ul>
          </nav>
        </footer>
      );
    } else {
      return (
        <footer>
          <nav>
            <ul>
              <li><NavLink to="/"><IoIosHome />Home</NavLink></li>
              <li><NavLink to="/login"><IoIosLogIn /> Login</NavLink></li>
              <li><NavLink to="/signin"><IoIosLogIn /> SignIn</NavLink></li>
            </ul>
          </nav>
        </footer>
      );
    }
  }
}