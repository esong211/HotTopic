import React, { Component } from 'react';
import { Container, Grid, Card, Accordion } from 'semantic-ui-react';



class Topic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topics: this.props.topics,
            activeIndex: 0
        };
    }

    componentDidMount() {
        console.log('mounted');
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex })
    };

    generateTopicBox = (item, index) => (<Grid.Column>

        <Accordion>
            <Accordion.Title
                active={this.state.activeIndex === index}
                index={index}
                onClick={this.handleClick}>
                <Card>
                    <Card.Content>
                        <Card.Header>
                            {'Topic ' + (index + 1)}
                        </Card.Header>
                        <Card.Meta>
        <span className='date'>
            {item['coord'][0] + ', ' + item['coord'][1]}
        </span>
                        </Card.Meta>
                    </Card.Content>
                </Card></Accordion.Title>
            <Accordion.Content active={this.state.activeIndex===index}>
                {item['tweet'].topic.map(this.generateTweetBox)}</Accordion.Content>
        </Accordion>


        </Grid.Column>);

    generateTweetBox = (item, index) => (
        <Card color={'teal'}>
            <Card.Content>
                <Card.Description >

                {item}
                </Card.Description>
            </Card.Content>
        </Card>
    );

    render() {
        let activeIndex = this.state.activeIndex;
        console.log("eifje" );
        console.log(this.state.topics );
        const topicBox = this.state.topics.length === 0 ? (
                <Accordion>
                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleClick}>
                        <Card>
                    <Card.Content>
                        <Card.Header>
                            No Topic
                        </Card.Header>
                        <Card.Meta>
        <span className='date'>
            No Location Selected
        </span>
                        </Card.Meta>
                        <Card.Description>
                            Please Select a Location
                        </Card.Description>
                    </Card.Content>
                </Card></Accordion.Title>
                    <Accordion.Content active={activeIndex===1}>grg</Accordion.Content>
                </Accordion>
                    )
            : this.state.topics.map(this.generateTopicBox);
        return (
            <Container style={{'margin-top': '20px' }}>
            <Grid columns={3} centered>
        {topicBox}
            </Grid>
            </Container>
        );
    }
}

export default Topic;

