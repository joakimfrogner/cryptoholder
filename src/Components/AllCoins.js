import React from 'react';

export default class AllCoins extends React.Component {
    constructor() {
        super();
        this.state = {
            items:[]
        };
    }

    componentDidMount(){
        fetch('http://localhost:3000/coins')
            .then(result=>result.json())
            .then(items=>this.setState({items}))
        console.log("HELLO")
    }

    render() {
        return(
        <ul>
            {this.state.items.length ?
                this.state.items.map(item => <li key={item.name}><a href={"http://localhost:3000/coins/" + item.symbol}> {item.name}</a></li>) 
              : <li>Loading...</li>
            }
        </ul>
        )
    }
}
