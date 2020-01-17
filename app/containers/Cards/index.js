import React, { Component } from 'react';
import style from './cards.css';
import Draggable from 'react-draggable';
import _ from 'underscore';

import CloseIcon from '@material-ui/icons/Close';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { closeCard } from '../../actions/display'

@connect(
  state => ({
    cards: state.display.cards,
  }),
  dispatch => bindActionCreators({
    closeCard
  }, dispatch)
)

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positions: {},
    }
  }

  componentDidMount() {
    const { cards } = this.props;

    const newPositions = {};
    cards.forEach(card => {
      newPositions[card] = null;
    });

    this.setState({ positions: newPositions });
  }

  componentDidUpdate(prevProps) {
    const { cards: prevCards } = prevProps;
    const { cards } = this.props;
    const { positions } = this.state;

    if (prevCards.length < cards.length) { // Added card
      const newCard = cards[cards.length - 1];
      const newPositions = { ...positions, [newCard]: null };
      this.setState({ positions: newPositions });
    } else if (prevCards.length > cards.length) { // Closed card
      const closedCard = _.difference(prevCards, cards)[0];
      const newPositions = _.omit(positions, closedCard);
      this.setState({ positions: newPositions });
    }
  }

  handleDrag = (card, ui) => {
    const { positions } = this.state;
    const { x, y } = positions[card] || { x: 0, y: 0 };

    const newPositions = _.clone(positions);
    newPositions[card] = { x: ui.x, y: ui.y }

    this.setState({ positions: newPositions });
  };

  render() {
    const { cards, closeCard } = this.props;
    const { positions } = this.state;

    return (
      <div>
        <style type="text/css">{style}</style>
        { cards.map(card => (
          <Draggable
            bounds="html"
            // positionOffset={{x: '20%', y: '20%'}}
            position={positions[card]}
            onDrag={(e, ui) => this.handleDrag(card, ui)}
          >
            <div className="card padder-lg white-background">
              <button onClick={() => closeCard(card)}>
                <CloseIcon />
              </button>
              <div> Card ID: {card} </div>
            </div>
          </Draggable>
        ))}
      </div>
    );
  }
}
