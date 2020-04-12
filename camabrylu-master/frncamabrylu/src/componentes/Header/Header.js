import React from 'react';
import './Header.css'
export default ( {children, title, login} )=>{
const finalLogin = login || ((e)=>{});
return (<h1 oneClick={
    (e)=>{
        finalLogin(
            e,
            { 
                email:"manueleaguilarr@gmail.com",
                id: "Manuel",
                roles:["public","admin"]
                })}
        }>{title} {children}</h1>);
};