export default class CryptoHolder {
    constructor(api_token){
        this.api_token = api_token
        //this.uri = "https://cryptoholderapi.appspot.com"
        this.uri = 'http://localhost:3000'

        this._register_login = this._register_login.bind(this)
        this.get_my_coins = this.get_my_coins.bind(this)
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.add_coin = this.add_coin.bind(this)
        this.delete_coin = this.delete_coin.bind(this)
        this.update_coin = this.update_coin.bind(this)
    }

    usercheck = function(username){
        var body = {
            username: username
        }

        return fetch(this.uri + '/users/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&') 
        })
        .then(result => result.json())
        .then(json => {
            if(json.taken){
                return Promise.resolve()
            }
            return Promise.reject()
        })
        .catch(()=>{
            return Promise.reject()
        })
    }

    me = function(){
        return fetch(this.uri + '/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            }
        })
        .then(result => result.json())
        .then(json => {
            if(json.success){
                return Promise.resolve({user: json.user})
            }
            return Promise.reject({error: "Session expired."})
        })
        .catch(err => {
            return Promise.reject({error: err.error})
        })
    }

    admin_verify = function(){
        return fetch(this.uri+'/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
        })
        .then(result => result.json())
        .then(json => {
            if(json.success){
                return Promise.resolve()
            }else{
                return Promise.reject()
            }
        })
        .catch(err => {
            return Promise.reject()
        })
    }

    admin_add_coin = function(symbol, name, cm_ID){
        var body = {
            symbol: symbol,
            name: name,
            cm_ID: cm_ID
        }

        return fetch(this.uri+'/coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
            body: Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&') 
        })
        .then(result => result.json())
        .then(json => {
            if(json.success){
                return Promise.resolve()
            }else{
                return Promise.reject()
            }
        })
        .catch(err => {
            return Promise.reject()
        })
    }

    admin_delete_coin = function(symbol, name){
        return fetch(this.uri+'/coins/'+symbol, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
        })
        .then(result => result.json())
        .then(json => {
            if(json.success){
                return Promise.resolve()
            }else{
                return Promise.reject()
            }
        })
        .catch(err => {
            return Promise.reject()
        })
    }

    admin_edit_coin = function(symbol, coin){
        return fetch(this.uri+'/coins/'+symbol, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
            body: Object.keys(coin).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(coin[k])}`).join('&') 
        })
        .then(result => result.json())
        .then(json => {
            if(json.success){
                return Promise.resolve()
            }else{
                return Promise.reject()
            }
        })
        .catch(err => {
            return Promise.reject()
        })
    }

    get_coins = function(){
        return fetch(this.uri+'/coins').then(result => result.json()).then(json =>{
            if(json.length){
                return Promise.resolve(json)
            }
            
            return Promise.reject(json.message)
        })
        .catch((err)=>{
           return Promise.reject({error: "Failed to get coins."})
        })
    }
    
    add_coin = function(symbol, amount){
        var body = {
            symbol: symbol,
            amount: amount
        }

        return fetch(this.uri+'/me/coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
            body: Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&')
        })
        .then(response => response.json())
        .then(json => {
            if(json.success){
                return Promise.resolve({success: true, coin: json.coin})
            }else{
                return Promise.reject({error: json.message})
            }
        })
        .catch(err => {
            return Promise.reject({success: false, error: err.message})
        })
    }

    delete_coin = function(coin){
        var body = {
            coin: coin.symbol
        }

        return fetch(this.uri+'/me/coins', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            },
            body: Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&')
        })
        .then(response => response.json())
        .then(json => {
            if(json.success){
                return Promise.resolve({success: true})
            }else{
                return Promise.reject({success: false})
            }
        })
        .catch(err => {
            return Promise.reject({success: false, error: err.message})
        })
    }

    update_coin = function(coin){
        return this.delete_coin(coin).then(() => {
            return this.add_coin(coin.symbol, coin.amount).then(() => {
                return Promise.resolve({success: true})
            })
        })
        .catch(err => {
            return Promise.reject({success: false, error: err.message})
        })
        
    }

    get_my_coins = function(){
        return fetch(this.uri+'/me/coins', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': this.api_token,
            }
        })
        .then(response => response.json())
        .then(json => {
            if(json.success){
                json.coins.sort(function(a, b) {
                    return parseFloat(a.amount) < parseFloat(b.amount)
                })
                return Promise.resolve(json.coins)
            }else{
                return Promise.reject(json.message)
            }
        })
        .catch(err => {
            return Promise.reject({error: err.message})
        })
    }

    _register_login = function(username, password, url){
        var body = {
            username: username,
            password: password
        }

        return fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(body).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`).join('&')
        })
        .then(response => response.json())
        .then(json => {
            if(json.success)
                return Promise.resolve(json.token)
            else
                return Promise.reject(json.message)
        })
        .catch(error => {
            return Promise.reject({error: error.message})
        })
    }

    login = function(username, password){
        return this._register_login(username, password, this.uri + '/login')
    }

    register = function(username, password){
        return this._register_login(username, password, this.uri + '/register')
    }
}