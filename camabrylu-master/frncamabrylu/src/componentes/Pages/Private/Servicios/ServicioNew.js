import React, {Component} from 'react';
import Page from '../../Page';


export default class ServicioNew extends Component{
  constructor(){
    super();
  }

  render(){
    return (
      <Page auth={this.props.auth} pageTitle="Nuevo">
      </Page>
    )
  }
}