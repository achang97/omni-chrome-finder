import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Player, ControlBar, BigPlayButton,
  PlayToggle, ReplayControl, ForwardControl, VolumeMenuButton, CurrentTimeDisplay, TimeDivider, DurationDisplay, ProgressControl, RemainingTimeDisplay, PlaybackRateMenuButton, FullscreenToggle
} from 'video-react';

import style from './video-player.css';
import { getStyleApplicationFn } from 'utils/style';

const s = getStyleApplicationFn(style);

const CONTROL_BAR_COMPONENT_MAP = {
  PlayToggle: <PlayToggle key="play-toggle" order={1.1} />,
  ReplayControl: <ReplayControl key="replay-control" order={1.2} />,
  ForwardControl: <ForwardControl key="forward-control" order={1.3} />,
  VolumeMenuButton: <VolumeMenuButton key="volume-menu-button" order={2} />,
  CurrentTimeDisplay: <CurrentTimeDisplay key="current-time-display" order={3.1} />,
  TimeDivider: <TimeDivider key="time-divider" order={3.2} />,
  DurationDisplay: <DurationDisplay key="duration-display" order={3.3} />,
  ProgressControl: <ProgressControl key="progress-control" order={3.4} />,
  RemainingTimeDisplay: <RemainingTimeDisplay key="remaining-time-display" order={3.5} />,
  PlaybackRateMenuButton: <PlaybackRateMenuButton
    rates={[1, 1.25, 1.5, 2]}
    key="playback-rate"
    order={4}
  />,
  FullscreenToggle: <FullscreenToggle key="fullscreen-toggle" order={5} />
};

const CONTROL_BAR_COMPONENT_LIST = ['PlayToggle', 'ReplayControl', 'ForwardControl', 'VolumeMenuButton', 'CurrentTimeDisplay', 'TimeDivider', 'DurationDisplay', 'ProgressControl', 'RemainingTimeDisplay', 'PlaybackRateMenuButton', 'FullscreenToggle'];

const VideoPlayer = ({ url, fullscreenControlBarItems, minimizedControlBarItems, ...rest }) => {
  const [player, setPlayer] = useState({});
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current.subscribeToStateChange(handleStateChange);
  }, []);

  const handleStateChange = (state) => {
    // copy player state to this component's state
    setPlayer(state);
  }

  const controlBarItems = (player.isFullscreen && fullscreenControlBarItems) ? fullscreenControlBarItems : minimizedControlBarItems;
  return (
    <div className={s('rounded overflow-hidden')}>
      <Player
        ref={playerRef}
        {...rest}
      >
        <source src="https://youtu.be/xarC5jAiO7w" />
        <BigPlayButton position="center" className={s(`video-player-big-play-button ${player.hasStarted ? 'video-player-big-play-button-hide' : ''}`)} />
        <ControlBar disableDefaultControls autoHide={false} className={s('video-player-control-bar')}>
          { controlBarItems.map(item => CONTROL_BAR_COMPONENT_MAP[item])}
        </ControlBar>
      </Player>
    </div>
  );
}

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  fullscreenControlBarItems: PropTypes.arrayOf(PropTypes.oneOf(CONTROL_BAR_COMPONENT_LIST)),
  minimizedControlBarItems: PropTypes.arrayOf(PropTypes.oneOf(CONTROL_BAR_COMPONENT_LIST)),
};

VideoPlayer.defaultProps = {
  minimizedControlBarItems: ['PlayToggle', 'ProgressControl', 'FullscreenToggle'],
  fullscreenControlBarItems: CONTROL_BAR_COMPONENT_LIST,
};

export default VideoPlayer;
