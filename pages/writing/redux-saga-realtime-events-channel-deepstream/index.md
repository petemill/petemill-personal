---
title: "Handling realtime socket events with redux"
description: Using redux-saga channels to respond to deepstream.io events
created_utc: 2017/08/07 09:00:00
---

Performing asynchronous operations in response to events in React, using Redux actions and Redux saga handlers, is pretty straightforward: define a saga, wait for an action to occur, and then do whatever you want. When you're done, call another redux action if you want to update any application state.

This works well for patterns where we have user actions, like loading a view or clicking a button, and we want to fetch some data from a remote API over HTTP.

But it's different when we want to connect directly to a server over websocket, and respond to data event being pushed from the server. Deepstream.io is an example of that kind of server, but this applies to straight websocket connection (using socket.io or uws), or any similar event source.

A solution is to use redux-saga event channels. These allow you to subscribe to events, and then notify a waiting saga of that event. The saga can then dispatch a redux event, or anything it likes.

### Create a channel

```js
import { eventChannel } from 'redux-saga';


export default function createRecordListenerChannel(client, recordName, isList = false) {

  //create a redux-saga event channel that a saga can wait on for events to fire
  return eventChannel(emit => {

    //subscribe to the deepstream object (record or list)
    const record = client.record[isList ? 'getList' : 'getRecord'](recordName);
    //we need to wait a tick to subscribe, I *think* due to channel not being subscribed to when emitting in the same loop
    setImmediate(() => {
      record.subscribe(emit, true);
    });
    //provide the ability to stop the subscription
    const unsubs = () => {

      console.debug(`unsubscribing from ${isList ? 'list' : 'record'} in channel: ${recordName}`);
      record.unsubscribe(emit);
    }
    return unsubs;
  });
}
```


### Provide a wrapper
Now we can create a function that offers a forkable task for easy one-line use, with subscription, unsubscription, error-handling and cancellation built-in:
```js
import createRecordListenerChannel from './createRecordListenerChannel';
import { take, call, fork, cancelled } from 'redux-saga/effects';

export default function* sagaTaskSubscribeToDeepstreamRecord(client, recordName, isList, onRecordChange) {
  
  //create channel which subscribes to record
  let channel;
  try {
    channel = yield call(createRecordListenerChannel, client, recordName, isList);
  }
  //handle subscription error
  catch (chanErr) {
    console.error(`Error creating subscription channel for deepstream item ${recordName}`, chanErr);
    //re-throw
    throw chaneErr;
  }
  //we will repeat until cancelled
  while (true) {
    try {
      //wait for update to item
      const item = yield take(channel);
      //we have an update to the item
      console.debug(`Got an update for realtime ${isList ? 'list' : 'record'} named '${recordName}'`, item);
      //inform caller
      yield fork(onRecordChange, item);
      //loop round again and listen for updates...
    }
    catch (err) {
      //handle cancellation
      if (yield cancelled()) {
        //close the channel and unsubscribe
        channel.close();
        //we're done
        return;
      }
      //handle other error
      else {
        //log error
        console.error(`Error in saga task for deepstream subscription of ${isList ? 'list' : 'record'} '${recordName}'`, err);
      }
    }
  }
}
```

We can call this from any saga and have all this functionality exposed for any record:
```js
// ...
import subscribe from './sagaTaskSubscribeToDeepstreamRecord';


//a saga
export default function* mySaga({ client }) {
  
  //subscribe to updates to a record
  yield fork(subscribe, client, 'myRecordName', false, function*(record) {
    
    //record has changed...
    //do anything we like with the new data...
    //such as send it to the redux store
    yield put(Actions.newData(record));
  });
  
  // optionally continue with your function, subscribing to other records or waiting for redux actions
}
```

### Shared connection object
Unless we want to create a separate connection for each saga we create, we'll want to share the same object with all the saga functions. The `.run()` redux middleware provided by redux-saga luckily has an overload that allows us to pass objects through to the saga:
```js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import deepstream from 'deepstream.io-client-js';

import reducer from './reducers'
import mySagas from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

//create the (deepstream) connection and connect
const client = deepstream('myServerUrl');
client.login();

// run the sagas, passing the same connection object in
for (const saga of mySagas) {
  sagaMiddleware.run(saga, { client });
}
```


**Disclaimer:** this applies when your app has already scaled to the point where redux and redux-saga (or their equivalents) help maintainability. If it's a small simple single-view app with few actions and data changes, then this could just all be done in a single react class...
