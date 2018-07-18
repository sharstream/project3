import React, { Component } from "react";
import  { Thumbnail } from "react-bootstrap";

import API from "../../utils/API";
import { Col, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import StarRatingComponent from '../../components/StarRatingComponent';
import {
  Card,
  Collapse,
  Button,
  CardFooter,
  CardBody,
  CardTitle
} from 'reactstrap';

class Player extends Component {
  state = {
    player: [],
    currentUserEmail: "",
    currentUserName: "",
    clientID: "",
    manName: "",
    overallRating: 0,
    athletic: 0,
    offence: 0,
    defence: 0,
    collapse: false
  };

  componentDidMount() {
    const client = JSON.parse(localStorage.getItem("okta-token-storage"));
    this.setState({
      currentUserEmail: client.idToken.claims.email,
      currentUserName: client.idToken.claims.name,
      clientID: client.idToken.clientId
    });
    console.log(`current user: ` + this.state.currentUserName);
    console.log(`current email: ` + this.state.currentUserEmail);
    console.log(`client_id: ` + this.state.clientID);
    this.loadTeams();
  }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  loadTeams = () => {
    API.findPlayersByPlayerID(this.props.match.params._id)
      .then(res => this.setState({ player: res.data }))
      .then(() => {
        this.setState({ manName: this.state.player[0].name });
      })
      .catch(err => console.log(err));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  onOverallStarClick(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({ overallRating: nextValue });
  }
  onAthleticStarClick(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({ athletic: nextValue });
  }
  onOffenceStarClick(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({ offence: nextValue });
  }
  onDefenceStarClick(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({ defence: nextValue });
  }

  onStarClickCustomIcon(nextValue, prevValue, name) {
    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    this.setState({ rating_custom_icon: nextValue });
  }

  handleRankingSubmit = event => {
    event.preventDefault();
    if (this.state.playerID) {
      API.saveRanking({
        playerID: this.state.playerID,
        ClientID: this.state.clientID,
        overall: 4,
        pace: 4,
        dribbling: 4,
        passing: 4,
        shooting: 4,
        defense: 4,
        physicality: 4
      })
        .then(res => this.loadTeams())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Col size="md-12 sm-12">
          {this.state.player.length ? (
            <List>
              {this.state.player.map(man => (
                <ListItem key={man._id}>
                  <button type="button" className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <Card>
                    <CardBody>
                      <CardTitle>{man.name}</CardTitle>
                    </CardBody>
                    <Thumbnail alt={man.name} src={man.plyrImg} />
                    <CardBody>
                      <h6 className="card-title">Number: {man.jerseyNumber}</h6>
                      <p className="card-text">
                        Position: {man.postion}
                        <br />
                        Nationality: {man.nationality}
                      </p>
                    </CardBody>
                    <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>
                      Display
                    </Button>
                    <Collapse isOpen={this.state.collapse}>
                      <CardBody>
                        <strong>
                          {/* <h3>Editable with handlers (Rating from state is {this.state.rating}):</h3> */}
                          <br />
                            Overall: <StarRatingComponent
                              name="overall"
                              starCount={5}
                              value={this.state.overallRating}
                              onStarClick={this.onOverallStarClick.bind(this)} />
                          <br />
                            Athletic: <StarRatingComponent
                              name="Athletic"
                              starCount={5}
                              value={this.state.athletic}
                              onStarClick={this.onAthleticStarClick.bind(this)} />
                          <br />
                            Offence: <StarRatingComponent
                              name="Offence"
                              starCount={5}
                              value={this.state.offence}
                              onStarClick={this.onOffenceStarClick.bind(this)} />
                          <br />
                            Defence: <StarRatingComponent
                              name="Defence"
                              starCount={5}
                              value={this.state.defence}
                              onStarClick={this.onDefenceStarClick.bind(this)} />
                        </strong>
                      </CardBody>
                      <CardFooter className="text-muted"></CardFooter>
                    </Collapse>
                  </Card>

                </ListItem>
              ))}
            </List>
          ) : (
              <h3>No Results to Display</h3>
            )}
        </Col>
      </Container>
    );
  }
}
export default Player;