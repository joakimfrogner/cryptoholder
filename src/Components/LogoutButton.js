import React from 'react'
import Cookies from 'universal-cookie';

export default class LogoutButton extends React.Component {
    constructor(){
        super()
        this.logout = this.logout.bind(this)
    }

    logout(){
        const cookies = new Cookies()
        cookies.remove('x-api-key', { path: '/' })
        window.location.reload()
    }

    render(){
        return(
            <a onClick={()=>this.logout()}>Logout</a>
        )
    }
}