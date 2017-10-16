import React from 'react';

export default class LoginForm extends React.Component {
    constructor(){
        super();

        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    _handleKeyPress(e){
        if (e.key === 'Enter') {
            this.props.submit();
        }
    }

    render(){
        return (
            <div className='container'>
                <h1>Login / Register</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" onKeyPress={this._handleKeyPress} value={this.props.username} onChange={this.props.handleChangeUsername} placeholder="Enter username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" onKeyPress={this._handleKeyPress} value={this.props.password} onChange={this.props.handleChangePassword} placeholder="Enter password"/>
                    </div>
                    <div className="form-check">
                        <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" checked={this.props.isRegister} onChange={this.props.handleChangeCheckbox}/>
                        &nbsp;Register?
                        </label>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => this.props.submit()}>Submit</button>
                </form>
            </div>
        )
    }
}