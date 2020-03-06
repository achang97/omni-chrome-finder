import { delay } from 'redux-saga';
import { take, call, fork, all, cancel, cancelled, put, select } from 'redux-saga/effects';
import { doGet, doPost, doPut, doDelete } from '../utils/request'
import { LOGIN_SUCCESS } from '../actions/actionTypes'

let playerId = '' // the onesignal playerId

export default function* watchNotificationsRequests() {
  let action;

  while (action = yield take([LOGIN_SUCCESS])) {
    const { type, payload } = action;
    switch (type) {
      case LOGIN_SUCCESS:
      case REDUX_PERSIST_REHYDRATE: {
        yield fork(openNotificationChannel);
        // OneSignal.sendTag('logged_in', 'true');
        break;
      }
    }
  }
}

function *openNotificationChannel() {
  // const channel = yield call(notificationsChannel)

  var OneSignal = window.OneSignal;
  if (OneSignal) {
    OneSignal.push(function() {
      OneSignal.init({
        appId: process.env.ONE_SIGNAL_APP_ID,
      });
    });    
  }


  // while(true) {
  //   const { type, payload } = yield take(channel)

  //   switch(type) {
  //     case 'ids': {
  //       const { device } = payload
  //       playerId = device.userId

  //       yield fork(addPushIdToUser)
  //       break
  //     }
  //     case 'received': {
  //       yield fork(handleReceivedNotification, payload)
  //       break
  //     }
  //     case 'opened': {
  //       const { notificationInfo } = payload;
  //       yield fork(handleOpened, notificationInfo)
  //       break
  //     }
  //   }
  // }
}

function notificationsChannel() {
  return eventChannel(emit => {
    function onIds(device) {
      emit({ type: 'ids', payload: { device }})
    }

    function onReceived(notification) {
      emit({ type: 'received', payload: { notification }})
    }

    function onOpened(notificationInfo) {
      emit({ type: 'opened', payload: { notificationInfo } })
    }

    OneSignal.addEventListener('ids', onIds)
    OneSignal.addEventListener('received', onReceived)
    OneSignal.addEventListener('opened', onOpened)

    return () => {
      OneSignal.removeEventListener('ids', onIds)
      OneSignal.removeEventListener('received', onReceived)
      OneSignal.removeEventListener('opened', onOpened)
    }
  })
}

function *addPushIdToUser() {
  try {
    yield call(doPut, 'v1/users/addPushId', { playerId })
  } catch(error) {
    console.error(error)
  }
}

function *removePushIdFromUser() {
  try {
    yield call(doPut, 'v1/users/removePushId', { playerId })
  } catch(error) {
    console.error(error)
  }
}

function* handleOpened(notificationInfo) {
  const { notification: { payload: { additionalData } } } = notificationInfo;
  const { type } = additionalData;

  switch (type) {
    case 'friend_request': {
      NavigationService.navigate('Contacts');
      break;
    }
    case 'message': {
      const { roomId } = additionalData;

      yield put(chatSetCurrentRoomById(roomId));
      NavigationService.navigate('ChatMessages', { roomId, friend: { } });
      break;
    }
    case 'profile_view': {
      NavigationService.navigate('Home');
      break;
    }
    case 'double_blind': {
      const { otherUser: { profile_url: profileUrl } } = additionalData;
      NavigationService.navigate('Profile', { profileUrl });
      break;
    }
    case 'match': {
      const { cycle } = additionalData;

      const { matchCycles } = yield select(state => ({ matchCycles: state.feed.matchCycles }));
      const mostRecentCycle = matchCycles.length === 0 ? -1 : matchCycles[0].cycle;

      // Have to fetch cycle
      if (mostRecentCycle !== cycle) {
        yield put(getMatchesRequest(cycle, cycle - mostRecentCycle, false));
      }

      NavigationService.navigate('AllMatches');
      break;
    }
  }
}

function* handleReceivedNotification({notification}) {
  const { payload: { title, body: alertBody, additionalData } } = notification

  if(additionalData && additionalData.type == 'message') {
    const { roomId } = additionalData
    const {
      chat: {
        currentRoom
      }
    } = yield select()

    if(currentRoom && currentRoom.room.id == roomId) {
      return // ignore push
    }
  }

  if(Platform.OS == 'ios') {
    const badgeCount = yield call(getNumBadges)
    PushNotificationIOS.presentLocalNotification({ alertTitle: title, alertBody, applicationIconBadgeNumber: badgeCount })
  } else if(Platform.OS == 'android') {
    AndroidLocalPush.createNotification(title, alertBody)
  }
}
