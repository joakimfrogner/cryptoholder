import React from 'react'

export default class CoinPrice extends React.Component {
    constructor(){
        super()

        this.state = {
            price: ''
        }
    }

    componentDidMount(){
        var url = "https://api.coinmarketcap.com/v1/ticker/"

        fetch(url).then((result) => result.json()).then((json) => this.setState({price: json.find(c => c.symbol === this.props.coin.symbol).price_usd}))
    }

    render(){
        if(!this.state.price){
            return (
                <span></span>
            )
        }
        return(
            <span>{parseFloat(this.state.price * this.props.coin.amount).toFixed(2)}</span>
        )
    }
}