import React from 'react';
import Cookies from 'universal-cookie';

import CryptoHolder from './External/CryptoHolder'

import LoginForm from './Components/LoginForm';
import ControlPanel from './Components/ControlPanel';

export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            x_api_key: '',
            username: '',
            password: '',
            isRegister: true,
            showLogin: true
        }

        this.handleChangeUsername = this.handleChangeUsername.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)
        this.submit = this.submit.bind(this)
    }

    handleChangeUsername(event){
        this.setState({username: event.target.value})
        new CryptoHolder().usercheck(event.target.value)
        .then(result => {
            this.setState({isRegister: false})
        })
        .catch(result => {
            this.setState({isRegister: true})
        })
    }

    handleChangePassword(event){
        this.setState({password: event.target.value});
    }

    handleChangeCheckbox(event){
        this.setState({isRegister: (event.target.value === 'on' ? false : true)});
        event.target.value = (event.target.value === 'on' ? 'off' : 'on');
    }

    submit(){
        let action = (this.state.isRegister ? new CryptoHolder().register : new CryptoHolder().login)
        
        action(this.state.username, this.state.password)
        .then((token) => {
            const cookies = new Cookies();
            cookies.set('x-api-key', token, { path: '/' });
            this.setState({x_api_key: token, showLogin: false});
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount(){
        const cookies = new Cookies();
        let token = cookies.get('x-api-key');
        if(token){
            this.setState({showLogin: false, x_api_key: token});
        }
    }

    render(){
        if(this.state.showLogin){
            return (
                <div className='container-fluid'>
                    <LoginForm 
                        submit={this.submit} 
                        handleChangeCheckbox={this.handleChangeCheckbox} 
                        handleChangePassword={this.handleChangePassword} 
                        handleChangeUsername={this.handleChangeUsername}
                        username={this.state.username}
                        password={this.state.password}
                        isRegister={this.state.isRegister} />
                </div>
            )
        }

        return (
            <div className='container-fluid'>
                <ControlPanel x_api_key={this.state.x_api_key}/>
            </div>
        )
    }
}