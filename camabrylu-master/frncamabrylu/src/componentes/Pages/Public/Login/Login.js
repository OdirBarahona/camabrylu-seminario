import React, {Component} from 'react';
import Page from '../../Page';
import Field from '../../../Forms/Fields/Field';
import {Actions} from '../../../Forms/Buttons/Button';
import {emailRegex , emptyRegex} from '../../../Forms/Validators/Validators';

import {paxios, setLocalStorage} from '../../../Utilities/Utilities';
import {Redirect} from 'react-router-dom';
export default class Login extends Component{

  constructor(){
    super();
    this.state = {
      email:'',
      emailError:null,
      password:'',
      passwordError:null,
      redirecTo:false
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.onClickCreateAccount = this.onClickCreateAccount.bind(this);
    this.validate = this.validate.bind(this);
  }
  validate(state){
    let nameErrors = null;
    let tmpErrors = [];
    const {email, password} = state;
    if(email !== undefined){
      if (!emailRegex.test(email)) {
        tmpErrors.push("El correo debe tener formato correcto");
      }
      if ((/^\s*$/.test(email))) {
        tmpErrors.push("Debe Ingresar Correo Adecuado");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({},nameErrors, {emailError:tmpErrors.join('. ')});
      }
    }
    if (password !== undefined){
      tmpErrors = [];
      if ((emptyRegex.test(password))) {
        tmpErrors.push("Debe Ingresar Contraseña Adecuado");
      }
      if (tmpErrors.length) {
        nameErrors = Object.assign({}, nameErrors, { passwordError: tmpErrors.join('. ') });
      }
    }
      return nameErrors;
  }
  onChangeHandler(e){
    const  {name, value} = e.currentTarget;
    let errors = this.validate({[name]:value});
    if (!errors){
      errors = {[name+"Error"]:''};
    }
    this.setState({
      ...this.state,
      [name]:value,
      ...errors
    });
  }
  onClickLogin(e){
    e.preventDefault();
    e.stopPropagation();
    const errors = this.validate(this.state);
    if(errors){
      this.setState({...this.state, ...errors});
    } else {
        alert(JSON.stringify(this.state));
        const {email, password} = this.state;
        paxios.post(
          "/api/seguridad/login",
          {
            userEmail: email,
            userPswd: password
          }
        )
        .then((resp)=>{
          console.log(resp.data);
          this.props.login(resp.data);
          this.setState({...this.state, redirecTo: true })
        })
        .catch((error)=>{
          console.log(error);
        })
    }
  }
  onClickCreateAccount(e){
    e.preventDefault();
    e.stopPropagation();
    alert("Click en Crear Cuenta");
  }
  render(){
    if (this.state.redirecTo){
      const redirect = (this.props.location.state) ? this.props.location.state.from.pathname : '/';
      return (<Redirect to={redirect} />);
    }
    return (
      <Page pageTitle="Iniciar" auth={this.props.auth}>
        <Field
          name="email"
          caption="Correo"
          value={this.state.email}
          type="text"
          onChange={this.onChangeHandler}
          error={this.state.emailError}
        />
        <Field
          name="password"
          caption="Contraseña"
          value={this.state.password}
          type="password"
          onChange={this.onChangeHandler}
          error={this.state.passwordError}
        />
        <Actions>
          <button onClick={this.onClickLogin}>Iniciar Sesión</button>
          <button onClick={this.onClickCreateAccount}>Crear Cuenta</button>
        </Actions>
      </Page>
    );
  }
}