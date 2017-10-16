import React from 'react'
import Cookies from 'universal-cookie'
import CryptoHolder from '../External/CryptoHolder'
import {Line} from 'react-chartjs-2'

var Modal = require('react-modal')

export default class MyCoins extends React.Component {
    constructor(){
        super()

        this.state = {
            coins: [],
            coinDisplayingGraph: '',
            updateFieldState: {
                isUpdate: false,
                text: '',
                coinEditing: '',
            },
        }
    }

    componentDidMount(){
        this.getPrices()
    }

    getPrices(){
        new CryptoHolder(this.props.x_api_key).get_my_coins()
        .then(coins => {
            if(coins) {
                fetch("https://api.coinmarketcap.com/v1/ticker/").then((result) => result.json())
                .then((all_coins) => {
                    for(var i=0;i<all_coins.length;i++){
                        for(var j=0;j<coins.length;j++){
                            if(all_coins[i].symbol === coins[j].symbol){
                                coins[j].price_usd = all_coins[i].price_usd
                                coins[j].percent_change_1h = all_coins[i].percent_change_1h
                                coins[j].percent_change_24h = all_coins[i].percent_change_24h
                                coins[j].percent_change_7d = all_coins[i].percent_change_7d
                                coins[j].total_usd = all_coins[i].price_usd * coins[j].amount
                            }
                        }
                    }

                    coins.sort((a, b) => 
                        b.total_usd - a.total_usd
                    )

                    this.setState({coins: coins})
                })
            }
        })
        .catch(err => {
            console.log(err.error)
            if(err.error === "Invalid token."){
                const cookies = new Cookies()
                cookies.remove('x-api-key', { path: '/' })
                window.location.reload()
            }
        })
    }

    deleteCoinClick(coin){
        if(prompt("Are you sure? (y/n)") === "y"){
            new CryptoHolder(this.props.x_api_key).delete_coin(coin).then(() => {

                var arr = this.state.coins

                arr.splice(
                    arr.findIndex(
                      (i) => i.symbol === coin.symbol
                    ), 1
                );
                this.setState({coins: arr})
            })
        }
    }

    addCoinClick(){
        var coin = prompt("Input coin SYMBOL:")
        if(!coin) 
            return

        var amount = parseFloat(prompt("Input amount"), 10)
        if(amount){
            new CryptoHolder(this.props.x_api_key).add_coin(coin, amount)
            .then((result) => {
                fetch('https://api.coinmarketcap.com/v1/ticker/'+result.coin.cm_ID+'/').then(result2 => result2.json())
                .then(_coindata => {
                    var coindata = _coindata[0]

                    var new_coin = {
                        symbol: coindata.symbol,
                        amount: amount,
                        name: coindata.name,
                        price_usd: coindata.price_usd,
                        percent_change_1h: coindata.percent_change_1h,
                        percent_change_24h: coindata.percent_change_24h,
                        percent_change_7d: coindata.percent_change_7d,
                        total_usd: parseFloat(coindata.price_usd, 10) * parseFloat(amount)
                    }
    
                    var coins = this.state.coins
                    coins.push(new_coin)

                    coins.sort((a, b) => 
                        b.total_usd - a.total_usd
                    )
                    
                    this.setState({coins: coins})
                })
            })
            .catch(err => {
                console.log(err.error)
            })
        }
    }

    addToCoinClick(coin){
        var total = parseFloat(prompt("How much to add?"), 10) + parseFloat(coin.amount, 10)
        if(total){
            var new_coin = {
                symbol: coin.symbol,
                name: coin.name,
                amount: total
            }

            new CryptoHolder(this.props.x_api_key).update_coin(new_coin)
            .then(result => {
                if(result.success){
                    fetch('https://api.coinmarketcap.com/v1/ticker/'+coin.name+'/').then(result2 => result2.json())
                    .then(_coindata => {
                        var coindata = _coindata[0]
    
                        var coin_to_insert = {
                            symbol: coin.symbol,
                            amount: total,
                            name: coindata.name,
                            price_usd: coindata.price_usd,
                            percent_change_1h: coindata.percent_change_1h,
                            percent_change_24h: coindata.percent_change_24h,
                            percent_change_7d: coindata.percent_change_7d,
                            total_usd: parseFloat(coindata.price_usd, 10) * parseFloat(total)
                        }

                        var coins = this.state.coins
                        
                        coins.forEach((element, index) => {
                            if(element.symbol === new_coin.symbol) {
                                coins[index] = coin_to_insert;
                            }
                        });
    
                        this.setState({coins: coins})
                    })
                }else{
                    console.log(result.success)
                }
            })
            .catch(err => {
                console.log(err.error)
            })
        }
    }

    updateCoin(coin, amount){
        var new_amount = parseFloat(amount, 10)

        if(new_amount){
            var new_coin = {
                symbol: coin.symbol,
                name: coin.name,
                amount: new_amount
            }

            new CryptoHolder(this.props.x_api_key).update_coin(new_coin)
            .then(result => {
                if(result.success){
                    fetch('https://api.coinmarketcap.com/v1/ticker/'+coin.name+'/').then(result2 => result2.json())
                    .then(_coindata => {
                        var coindata = _coindata[0]
    
                        var coin_to_insert = {
                            symbol: coin.symbol,
                            amount: amount,
                            name: coindata.name,
                            price_usd: coindata.price_usd,
                            percent_change_1h: coindata.percent_change_1h,
                            percent_change_24h: coindata.percent_change_24h,
                            percent_change_7d: coindata.percent_change_7d,
                            total_usd: parseFloat(coindata.price_usd, 10) * parseFloat(amount)
                        }

                        var coins = this.state.coins
                        
                        coins.forEach((element, index) => {
                            if(element.symbol === new_coin.symbol) {
                                coins[index] = coin_to_insert;
                            }
                        });
    
                        this.setState({coins: coins, updateFieldState: {isUpdate: false, text: '', coinEditing: ''}})
                    })
                }else{
                    console.log(result.success)
                }
            })
            .catch(err => {
                console.log(err.error)
            })
        }
    }
    
    render(){
        return(
            <div className='container'>
                <h2>Your coins:</h2>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th className='right'>Change 1h</th>
                            <th className='right'>Change 24h</th>
                            <th className='right'>Change 7d</th>
                            <th className='right'>Amount</th>
                            <th className='right'>Price per (USD)</th>
                            <th className='right'>Price (USD)</th>
                            <th><AddCoinButton onClick={()=>this.addCoinClick()}/></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.coins.map(coin =>
                        <tr key={coin.symbol}>
                            <td>{coin.symbol}</td>
                            <td>{coin.name}</td>
                            <td className='right'>
                                <span style={{color: (coin.percent_change_1h < 0 ? 'red' : 'green')}}> {coin.percent_change_1h}%</span>
                            </td>
                            <td className='right'>
                                <span style={{color: (coin.percent_change_24h < 0 ? 'red' : 'green')}}> {coin.percent_change_24h}%</span>
                            </td>
                            <td className='right'>
                                <span style={{color: (coin.percent_change_7d < 0 ? 'red' : 'green')}}> {coin.percent_change_7d}%</span>
                            </td>
                            <td className='update right'>
                                <UpdateField 
                                    coin={coin} 
                                    state={this.state.updateFieldState}
                                    onChange={(e) => {
                                        this.setState({updateFieldState: {isUpdate: true, text: e.target.value, coinEditing: coin.symbol}})
                                    }}
                                    onKeyDown={(e)=>{
                                        if (e.key === 'Enter') {
                                            this.updateCoin(coin, this.state.updateFieldState.text)
                                        } else if(e.key === "Escape") {
                                            this.setState({updateFieldState: {isUpdate: false, text: '', coinEditing: ''}})
                                        }
                                    }}
                                    onClick={()=>{
                                        this.setState({updateFieldState: {isUpdate: true, text: '', coinEditing: coin.symbol}})
                                    }}
                                    onBlur={()=>{
                                        this.setState({updateFieldState: {isUpdate: false, text: '', coinEditing: ''}})
                                    }}/> 
                            </td>
                            <td className='right'>
                                ${parseFloat(coin.price_usd, 10).toFixed((parseFloat(coin.price_usd, 10) < 0.01 ? (-Math.floor( Math.log(coin.price_usd) / Math.log(10))) : 2))}
                            </td>
                            <td className='right'>
                                ${parseFloat(coin.total_usd, 10).toFixed(2)}
                            </td>
                            <td className='add-delete'>
                                <table className='innerTable'>
                                    <tbody>
                                        <tr>
                                        <td>
                                            <CoinGraphButton onClick={()=>this.setState({coinDisplayingGraph: coin.symbol})}/>
                                        </td>
                                        <td>
                                            <AddCoinButton onClick={()=>this.addToCoinClick(coin)}/>
                                        </td>
                                        <td>
                                            <DeleteButton onClick={()=>this.deleteCoinClick(coin)}/>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <Modal isOpen={coin.symbol === this.state.coinDisplayingGraph}>
                                <CoinGraph coin={coin} onCloseClicked={() => this.setState({coinDisplayingGraph: ''})} onFail={() => this.setState({coinDisplayingGraph: ''})} />
                            </Modal>
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>SUM</strong></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='right'>
                                <strong>
                                ${parseFloat(this.state.coins.reduce((a, b) => a + b.total_usd, 0), 10).toFixed(2)}
                                </strong>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
          </div>
        )
    }
}

class CoinGraph extends React.Component {
    constructor(){
        super()

        this.state = {
            data: [],
            days: 30,
        }
    }

    componentDidMount(){
        fetch("https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-"+this.props.coin.symbol+"&tickInterval=day")
        .then(result => result.json())
        .then(json => {
            if(json.success){
                var data = json.result
                this.setState({data: data})
            }else{
                this.props.onFail()
            }
        })
        .catch(()=>{
            this.props.onFail()
        })
    }

    render(){
        let selected_data = this.state.data.slice(-1*this.state.days).map(day => { return {price: day.O, time: day.T } })

        let data = {
            labels: selected_data.map(d => d.time.substr(0, 10)),
            datasets: [{
                label: 'Price',
                type: 'line',
                data: selected_data.map(d => d.price),
                fill: true,
                borderColor: '#336699',
                backgroundColor: 'rgba(0,0,0,.3)',
                pointBorderColor: '#336699',
                pointBackgroundColor: '#336699',
                pointHoverBackgroundColor: '#336699',
                pointHoverBorderColor: '#336699',
            }]
        }

        let options = {
            responsive: true
        }
        
        return (
            <div>
                <div className="row">
                    <h1 className="col-md-4">BTC / {this.props.coin.symbol}</h1>
                    <div className="slidercontainer col-md-4">
                        <span>Days to show: {this.state.days} &nbsp;&nbsp;</span>
                        <input type="range" min="10" max={this.state.data.length} value={this.state.days} className="slider" onChange={(e)=>this.setState({days: e.target.value})}/>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-1"></div>
                    <button className="col-md-1 text-center" onClick={this.props.onCloseClicked}>Close</button>
                </div>
                <Line data={data} options={options}/>
            </div>
        )
    }
}

function CoinGraphButton(props) {
    return <span onClick={props.onClick} className='fa fa-line-chart'></span>
}

function UpdateField(props) {
    return ((props.state.isUpdate && props.state.coinEditing === props.coin.symbol)
            ? <input
                type='text' 
                autoFocus
                value={props.state.text}
                onBlur={() => props.onBlur()}
                onKeyDown={(e) => props.onKeyDown(e)} 
                onChange={(e) => props.onChange(e)}/>
                
             : <a onClick={props.onClick}>{parseFloat(props.coin.amount, 10).toFixed(( props.coin.price_usd > 500 ? 4 : 2 ))}</a>)
}

function AddCoinButton(props) {
    return <span onClick={props.onClick} className='fa fa-plus'></span>
}

function DeleteButton(props) {
    return <span onClick={props.onClick} className='fa fa-trash-o'></span>
}