import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Player, ControlBar, BigPlayButton,
  PlayToggle, ReplayControl, ForwardControl, VolumeMenuButton, CurrentTimeDisplay, TimeDivider, DurationDisplay, ProgressControl, RemainingTimeDisplay, PlaybackRateMenuButton, FullscreenToggle
} from 'video-react';

import "video-react/dist/video-react.css";

import style from './video-player.css';
import { getStyleApplicationFn } from '../../../utils/styleHelpers';
const s = getStyleApplicationFn(style);


const CONTROL_BAR_COMPONENT_MAP = {
  PlayToggle: <PlayToggle key="play-toggle" order={1} />,
  ReplayControl: <ReplayControl key="replay-control" order={2} />,
  ForwardControl: <ForwardControl key="forward-control" order={3} />,
  VolumeMenuButton: <VolumeMenuButton key="volume-menu-button" order={4} />,
  CurrentTimeDisplay: <CurrentTimeDisplay key="current-time-display" order={5} />,
  TimeDivider: <TimeDivider key="time-divider" order={6} />,
  DurationDisplay: <DurationDisplay key="duration-display" order={7} />,
  ProgressControl: <ProgressControl key="progress-control" order={8} />,
  RemainingTimeDisplay: <RemainingTimeDisplay key="remaining-time-display" order={9} />,
  PlaybackRateMenuButton: <PlaybackRateMenuButton
    rates={[1, 1.25, 1.5, 2]}
    key="playback-rate"
    order={10}
  />,
  FullscreenToggle: <FullscreenToggle key="fullscreen-toggle" order={11} />
};

const CONTROL_BAR_COMPONENT_LIST = ['PlayToggle', 'ReplayControl', 'ForwardControl', 'VolumeMenuButton', 'CurrentTimeDisplay', 'TimeDivider', 'DurationDisplay', 'ProgressControl', 'RemainingTimeDisplay', 'PlaybackRateMenuButton', 'FullscreenToggle'];

class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      player: {},
    }
  }

  componentDidMount() {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange);
  }

  handleStateChange = (state) => {
    // copy player state to this component's state
    this.setState({
      player: state
    });
  }

  render() {
  	const { url, fullscreenControlBarItems, minimizedControlBarItems, ...restProps } = this.props;
    const { player } = this.state;

    const controlBarItems = (player.isFullscreen && fullscreenControlBarItems) ? fullscreenControlBarItems : minimizedControlBarItems;

    return (
      <div className={s("rounded overflow-hidden")}>
  	    <Player
  	      ref={player => this.player = player}
  	      {...restProps}
  	    >
  	      <source src={url} />
          <BigPlayButton position="center" className={s(`video-player-big-play-button ${player.hasStarted ? 'video-player-big-play-button-hide' : ''}`)} />
  	      <ControlBar disableDefaultControls autoHide={false} className={s("video-player-control-bar")}>
            { controlBarItems.map(item => CONTROL_BAR_COMPONENT_MAP[item])}
  	      </ControlBar>
  	    </Player>
      </div>
    );
  }
}

VideoPlayer.propTypes = {
	url: PropTypes.string,
  fullscreenControlBarItems: PropTypes.arrayOf(PropTypes.oneOf(CONTROL_BAR_COMPONENT_LIST)),
  minimizedControlBarItems: PropTypes.arrayOf(PropTypes.oneOf(CONTROL_BAR_COMPONENT_LIST)),
}

VideoPlayer.defaultProps = {
  minimizedControlBarItems: ['PlayToggle', 'ProgressControl', 'FullscreenToggle'],
  fullscreenControlBarItems: CONTROL_BAR_COMPONENT_LIST,
}

export default VideoPlayer;