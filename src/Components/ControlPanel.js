import React from 'react'
import Cookies from 'universal-cookie'
import MyCoins from './MyCoins'
import LogoutButton from './LogoutButton'
import CryptoHolder from '../External/CryptoHolder'

export default class ControlPanel extends React.Component {
    constructor(){
        super();
        this.state = {
            user: {
                username: '',
                isAdmin: false,
                showAdmin: false
            }
        }
    }

    componentDidMount(){
        new CryptoHolder(this.props.x_api_key).me()
        .then(result => {
            this.setState({user: result.user})
        })
        .catch(err => {
            console.log(err.error)
            const cookies = new Cookies()
            cookies.remove('x-api-key', { path: '/' })
            window.location.reload()
        })

        new CryptoHolder(this.props.x_api_key).admin_verify()
        .then(()=>{
            this.setState({isAdmin: true})
        })
    }

    render_admin(){
        if(this.state.isAdmin && this.state.showAdmin){
            return (
                <AdminPanel x_api_key={this.props.x_api_key}/>
            )
        }
    }

    render_admin_switch(){
        if(this.state.isAdmin){
            var text = (this.state.showAdmin ? 'Hide' : 'Show')
            return (
                <span>
                    <a onClick={() => this.setState({showAdmin: !this.state.showAdmin})}>{text} admin view</a>&nbsp;|&nbsp;
                </span>
            )
        }
    }

    render(){
        return(
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6'>
                        <h1>Welcome, {this.state.user.username}</h1>
                    </div>
                    <div className='col-md-6' style={{textAlign: 'right', cursor: 'pointer'}}>
                        {this.render_admin_switch()}
                        <LogoutButton/>
                    </div>
                </div>
                <div className='row'>
                    {/*<div className='container'>
                        <h2>You have invested {this.state.user.currency} {this.state.user.amount_spent}</h2>
                    </div>*/}
                    {this.render_admin()}
                    <MyCoins x_api_key={this.props.x_api_key}/>
                </div>
            </div>
        )
    }
}

class AdminPanel extends React.Component {
    constructor(){
        super()
        this.state = {
            coins: [],
        }
    }

    componentDidMount(){
        new CryptoHolder(this.props.x_api_key).get_coins().then(json => {
            this.setState({coins: json})
        })
    }

    render(){
        return (
            <div className='container'>
            <h2>Coins:</h2>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>+</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.coins.map(coin =>
                    <tr key={coin.symbol}>
                        <td>{coin.symbol}</td>
                        <td>{coin.name}</td>
                        <td>DELETE</td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )
    }
}