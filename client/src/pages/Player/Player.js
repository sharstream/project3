import React, { Component } from "react";
import { Thumbnail } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import {
  Badge
} from 'reactstrap';

import API from "../../utils/API";
import { Col, Container } from "../../components/Grid";
import StarRatingComponent from "../../components/StarRatingComponent";
import {
  Card,
  Collapse,
  CardFooter,
  CardBody,
  CardTitle,
} from "reactstrap";
import { Modal } from "react-bootstrap";
import { withAuth } from "@okta/okta-react";

export default withAuth(
  class Player extends Component {
    state = {
      player: [],
      ratings: [],
      userId: "",
      currentUserEmail: "",
      currentUserName: "",
      clientId: "",
      manName: "",
      manTeamID: "",
      overallRating: 0,
      pace: 0,
      dribbling: 0,
      passing: 0,
      shooting: 0,
      defense: 0,
      physicality: 0,
      collapse: false,
      modal: false
    };

    componentDidMount() {
      const client = JSON.parse(localStorage.getItem("okta-token-storage"));
      this.setState({
        currentUserEmail: client.idToken.claims.email,
        currentUserName: client.idToken.claims.name,
        userId: client.idToken.claims.sub,
        clientId: client.idToken.clientId
      });
      this.loadPlayer(this.props.match.params._id);
      this.LoadRatingByPlayerID(this.props.match.params._id);
    }

    toggle = () => {
      this.setState({ collapse: !this.state.collapse });
    };

    LoadRatingByPlayerID = _id => {
      API.findRatingByPlayerID(_id)
      .then(res => this.setState({ ratings: res.data}))
      .then(() => this.setState({overallRating: this.state.ratings[0].overall}))
      .then(() => this.setState({pace: this.state.ratings[0].pace}))
      .then(() => this.setState({dribbling: this.state.ratings[0].dribbling}))
      .then(() => this.setState({passing: this.state.ratings[0].passing}))
      .then(() => this.setState({shooting: this.state.ratings[0].shooting}))
      .then(() => this.setState({defense: this.state.ratings[0].defense}))
      .then(() => this.setState({physicality: this.state.ratings[0].physicality}))
      .catch(err => console.log(err));
    }

    loadPlayer = _id => {
      API.findPlayersByPlayerID(_id)
        .then(res => this.setState({ player: res.data }))
        // .then(this.setState({ manTeamID: res.data[0].teamID }))
        .then(() => {
          this.setState({ manName: this.state.player[0].name });
        })
        .then(() => {
          this.setState({ manTeamID:  this.state.player[0].teamID });
        })
        .catch(err => console.log(err));
    };

    handleInputChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    };

    onOverallStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ overallRating: nextValue });
    }
    onPaceStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ pace: nextValue });
    }
    onDribblingStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ dribbling: nextValue });
    }
    onShootingStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ shooting: nextValue });
    }
    onDefenseStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ defense: nextValue });
    }
    onPhysicalityStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ physicality: nextValue });
    }
    onPassingStarClick(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ passing: nextValue });
    }

    onStarClickCustomIcon(nextValue, prevValue, name) {
      console.log(
        "name: %s, nextValue: %s, prevValue: %s",
        name,
        nextValue,
        prevValue
      );
      this.setState({ rating_custom_icon: nextValue });
    }

    saveRanking = event => {
      event.preventDefault();
      API.saveRanking({
        playerID: this.props.match.params._id,
        playerName: this.state.manName,
        playerTeamID: this.state.manTeamID,
        clientID: this.state.clientId,
        userID: this.state.userId,
        username: this.state.currentUserName,
        currentEmail: this.state.currentUserEmail,
        overall: this.state.overallRating,
        pace: this.state.pace,
        dribbling: this.state.dribbling,
        passing: this.state.passing,
        shooting: this.state.shooting,
        defense: this.state.defense,
        physicality: this.state.physicality
      }).catch(err => console.log(err));
      this.setState({ modal: true });
    };

    handleClose = (e) => {
      e.preventDefault();
      this.setState({ modal: true });
    };

    render() {

      return (
        !this.state.modal ? (
          <Modal
            show={!this.state.modal}
            animation={this.state.modal}
            backdrop={!this.state.modal}
          >
            <Modal.Header>
              Player Rating Form
              <button type="button" className="close" aria-label="Close" onClick={e => this.handleClose(e)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>
            <Modal.Body>
              <Container fluid>
                <Col size="md-12 sm-12">
                  {this.state.player.length ? (
                    <div>
                      {this.state.player.map(man => (
                        <Card key={man._id}>
                          <CardBody>
                            <CardTitle>{man.name}</CardTitle>
                          </CardBody>
                          <Thumbnail alt={man.name} src={man.plyrImg} />
                          <CardBody>
                            <h3 className="card-title">
                              <p>
                                <Badge color="light" pill>Kit #:</Badge>
                                <Badge color="primary" pill>{man.jerseyNumber}</Badge>
                              </p>
                            </h3>
                            <h4>
                              <br/>
                              <Badge color="light" pill>Position:</Badge>
                              <Badge color="light" pill>{man.postion}</Badge>
                              <br />
                              <Badge color="light" pill>Nationality:</Badge>
                              <Badge color="light" pill>{man.name1}</Badge>
                            </h4>

                            <p className="card-text">

                            </p>
                          </CardBody>
                          <button
                            className = "btn btn-primary btn-lg"
                            onClick={this.toggle}
                            style={{ marginBottom: "1rem" }}
                          >
                            Display
                          </button>
                          <Collapse isOpen={this.state.collapse}>
                            <CardBody>
                              <h5>
                                <Badge color="light" pill>Overall:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="overall"
                                starCount={5}
                                value={this.state.overallRating}
                                onStarClick={this.onOverallStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Pace:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="pace"
                                starCount={5}
                                value={this.state.pace}
                                onStarClick={this.onPaceStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Dribbling:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="dribbling"
                                starCount={5}
                                value={this.state.dribbling}
                                onStarClick={this.onDribblingStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Passing:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="passing"
                                starCount={5}
                                value={this.state.passing}
                                onStarClick={this.onPassingStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Shooting:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="shooting"
                                starCount={5}
                                value={this.state.shooting}
                                onStarClick={this.onShootingStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Defense:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="defense"
                                starCount={5}
                                value={this.state.defense}
                                onStarClick={this.onDefenseStarClick.bind(this)}
                              />
                              <br />
                              <h5>
                                <Badge color="light" pill>Physical:</Badge>
                              </h5>
                              <StarRatingComponent
                                name="physicality"
                                starCount={5}
                                value={this.state.physicality}
                                onStarClick={this.onPhysicalityStarClick.bind(this)}
                              />
                              <br />
                            </CardBody>
                            <CardFooter className="text-muted" />
                          </Collapse>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <h3>No Results to Display</h3>
                  )}
                </Col>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-primary" onClick={e => this.handleClose(e)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={e => this.saveRanking(e)}>
                Submit Ratings
              </button>
            </Modal.Footer>
          </Modal>
        ) : (
          <Redirect
            from={`/player/${this.state.player._id}`}
            to={`/teamsGet/`+this.state.manTeamID}
          />
        )
      );
    }
  }
);
