---
title: Measuring Viewport size with Google Analytics
link_previous: http://wishfulcode.com/2011/11/02/measuring-viewport-size-with-google-analytics/
description: Send data with actual viewport size of the browser, instead of the size of the whole screen
created_utc: 2011/11/02 00:02:54
---


Google Analytics recently [updated their API so that it's possible to track non-interaction events](http://analytics.blogspot.com/2011/10/non-interaction-events-wait-what.html) without reducing the bounce rate to 0% when automatically tracking events on many or every pageview. They did this by including a boolean [parameter on the _trackEvent method call](http://code.google.com/apis/analytics/docs/tracking/eventTrackerGuide.html#non-interaction) which, when set to `True`, indicates that the event was not based on user-interaction. Now we can send extra information to google analytics and not have it interpret that information as user interaction - and one piece of information we've always wanted to track in Google Analytics is viewport size.

It's great that GA already tracks screen resolution, but that doesn't help us know what size the viewable area within the browser windows actually is, so let's track the initial size, and then anytime the user resizes the window:

```javascript
//send to GA window viewport size on initial load and when resized as non-interactive events
$(function() {
  //track viewport dimensions
  var viewportWidth=$(window).width();
  _gaq.push(['_trackEvent', 'Viewport Dimensions', 'Viewport Dimensions Initial', viewportWidth+'x'+$(window).height(), viewportWidth, true]);
  //track viewport dimensions being changed by resize (throttled)
  var gaResizeCompleteHl;
  $(window).resize(function(){
    clearTimeout(gaResizeCompleteHl);
    gaResizeCompleteHl = setTimeout(function(){
      var viewportWidth = $(window).width();
      _gaq.push(['_trackEvent', 'Viewport Dimensions', 'Viewport Dimensions Resized', viewportWidth+'x'+$(window).height(), viewportWidth, true]);
    }, 500);
  });
});
```

*paste this after your google analytics code*

*...and apologies for being lazy - my example code requires jQuery*

Since events allow for a numeric value to go with the action, I choose to send the width which GA can use to do powerful filtering during segmentation. One of the biggest but most exciting challenges at the moment for web development is producing sites which respond beautifully to different screens, different methods of interaction and different amounts and types of data. In order to build those sites to the users' needs, we need as much data as possible about how people are using our products. Using Google Analytics and the above, we can segment the existing GA data and run queries using the new viewport information to answer questions such as:

  * What percentage of people run their browsers at full screen width?
  * How many tablet (or phone) users are browsing in portrait versus landscape?
  * When or why do people resize their browsers?

On a similar note, when thinking about designing for larger screens whilst I'm completely driven that we create experiences which make use of the whole screen, I have mixed feelings towards Mac OS. First, I panic because of the pre-Lion versions' tendencies to run browsers at very reduced widths compared to screen-widths. Then I feel excited about Lion's full-screen mode, and how much users embrace and love it. Seeing that and the browsing experience on Windows 8 makes it clear the direction of travel and our task is to make those full-screen experiences as usable and beautiful as possible.
