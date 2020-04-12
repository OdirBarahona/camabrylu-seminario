import React, {Component} from 'react';
import Page from '../../Page';
import { Redirect } from 'react-router-dom';
import {saxios} from '../../../Utilities/Utilities';

import './ServicioDetail.css';
export default class ServicioDetail extends Component{
  constructor(){
    super();
    this.state = {} 
  }
  componentDidMount()
  {
    const prodId = this.props.match.params.id;
    saxios.get(
      `/api/limpieza/servicios/find/${prodId}`
    )
    .then((data)=>{
      this.setState(data.data);
    })
    .catch((e)=>{
      console.log(e);
    })
  }
   
  render(){
      const servId = this.props.match.params.id;
      if(!(prodId && true)){
        return (<Redirect to="/servicios"/>)
      }
      var {id, descripcionServicio, imgUrl, precio} = this.state;
      return (
        <Page pageTitle={id} auth={this.props.auth}>
          <span className="detailitem">{id}</span>
          <span className="detailitem">{descripcionServicio}</span>
          <span className="detailitem">{precio}</span>
          <img className="detailimg" src={imgUrl} />

        </Page>
      )
  }
}