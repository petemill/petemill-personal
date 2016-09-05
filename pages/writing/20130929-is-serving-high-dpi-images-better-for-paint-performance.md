---
title: Is serving high dpi images better for paint performance?
link_previous: http://wishfulcode.com/2013/09/29/is-serving-high-dpi-images-better-for-paint-performance/
description: Measuring overhead time for browser upscaling, downscaling and rendering
created_utc: 2013/09/29 22:55:18
---

Whilst looking at paint times of various elements recently, I noticed that sometimes images are causing some long paint times when in-view. After digging around I found that it was on certain sites which aren't optimized for high dpi screens like the one in my retina MacBook. I then noticed the paint times are reduced when swapping the image out for a 2x one. For these images, the image is displayed 1:1 and there is no upscaling.

I experimented with an isolated example of an image forced to a 600x300 virtual pixel size through CSS. I then used a 600x300 image, a 1200x600 image (i.e. _2x_) and measured the paint time using Chrome Dev tools.

![600x300 image displayed at 1200x600 physical pixels - 10.8ms paint time](../media-a/image-paint-performance-1.png){.content-image} ***600x300 image displayed at 1200x600 physical pixels - 10.8ms paint time***

![1200x600 image displayed at 1200x600 physical pixels - 4.3ms paint time](../media-a/image-paint-performance-2.png){.content-image} ***1200x600 image displayed at 1200x600 physical pixels - 4.3ms paint time***

 It's clear to see that the scaling causes a 6ms - 16ms overhead on paint, which is unfortunate given for 60fps we need the entire viewport to paint in 16ms, and I'm sure most sites have more than a single image for the browser to render. I think what this shows though is that any image scaling is going to cause paint overhead. Unfortunately, many developers, including ourselves at Condé Nast, are using percentage-based widths for responsive designs, and therefore _downscaling_ for most users in lieu of a better responsive image solution. A further test (displaying the an 1800x1200 image at 600x300 using 1200x600 physical pixels) shows that downscaling can be even more costly. I would like to take the time to put together a table with a  more comprehensive set of test results at different sizes and pixel densities.

 ![1800x1200 iamage displayed at 1200x600 physical pixels - 23.5ms paint time](../media-a/image-paint-performance-3.png){.content-image} ***1800x1200 image displayed at 1200x600 physical pixels - 23.5ms paint time***
