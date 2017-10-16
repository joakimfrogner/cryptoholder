import React from 'react'

export default class CoinSum extends React.Component {
    constructor(){
        super()
        this.state = {
            sum: 0
        }
    }

    componentDidMount(){
        var url = "https://api.coinmarketcap.com/v1/ticker/"

        fetch(url).then((result) => result.json()).then((json) => {
            var my_sums = []
            
            for(var i=0;i<json.length;i++){
                for(var j=0;j<this.props.coins.length;j++){
                    if(json[i].symbol === this.props.coins[j].symbol){
                        my_sums.push(parseFloat(json[i].price_usd))
                    }
                }
            }

            this.setState({sum: parseFloat(my_sums.reduce((a, b) => a + b).toFixed(2))})
            
        })
    }

    render(){
        return this.state.sum
    }
}