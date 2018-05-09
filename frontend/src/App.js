import React, { Component } from 'react';
import { Input, Button, Container, Loader, Dimmer } from 'semantic-ui-react';
import Topic from './Topic/Topic';

import openSocket from 'socket.io-client';
import logo from './logo.svg';
import './App.css';



class App extends Component {
    state = { loading: false };
    constructor(props) {
        super(props);
        const socket = openSocket('http://localhost:8000');
        function getResponse(cb) {

            socket.on('response', response => cb(null, response));

        }
        getResponse((err, response) => {
            let topics = this.state.topics;
            topics.push(response);
            this.setState({
                topics,
                loading: false
            });
        });
        // topics: [{'coord': ['0404','4040'], 'tweet':{topic:['test','test']}}]
        this.state = {
            timestamp: 'no timestamp yet',
            socket,
            position: '',
            lat: null,
            long: null,
            topics: [],
            response: '',
            loading: false,
            message: '',
        };
    }


    componentDidMount() {

    }

    sendMessage = () => {
        let decimals = (item) => {
            if (Math.floor(item.valueOf()) === item.valueOf()) return 0;
            return item.toString().split(".")[1].length || 0;
        }
        // error handling
        try {
            console.log(this);
            if (decimals(this.state.lat) < 6 || decimals(this.state.long) < 6) {
                this.setState({
                    message: 'Not enough precision for latitude/longitude, make sure at least 6 decimal places!',
                });
                return;

            }
        }
        catch(err){
            this.setState({
                message: 'Blank or Incorrect Format',
            });
            return;

        }
        if(!this.state.loading) {
            const latlong = [this.state.lat, this.state.long];
            this.setState({
                loading: true,
            });
            this.state.socket.emit('message', latlong);
        }

    }


    handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change)
    };


    render() {
        /*
        containerElement={ <div style={ {height: '100%'} } /> }
        mapElement={ <div style={ {height: '400px'} } /> }
        */
        console.log(this.state.topics);

        return (
            <div className="App">
                <Loader active={this.state.loading}/>
                <Dimmer active={this.state.loading}/>

                <div className="App-header" style={{marginBottom : '30px'}}>
                    <h2>Welcome to Social Media Finder</h2>
                </div>
                <Input
                    loading={this.state.loading}
                    icon="user"
                    name="lat"
                    placeholder={this.state.lat}
                    onChange={this.handleChange}
                />
                <Input
                    loading={this.state.loading}
                    icon="user"
                    name="long"
                    placeholder={this.state.long}
                    onChange={this.handleChange}
                />
                <Container> {this.state.message} </Container>
                <Button onClick={this.sendMessage}> Find Topic! </Button>
                <Container>Enter the Latitude/Longitude and find the popular relevant tweet around the area!</Container>
                <Container>After it processes, you can enter another tweet and see past queries</Container>
            <Topic topics={this.state.topics}/>
            </div>
        );
    }
}

export default App;
