---
title: Responsive Images - Thoughts before Edge Conf, and the Element Size Problem
link_previous: http://wishfulcode.com/2013/09/20/responsive-images-thoughts-before-edge-conf-and-the-element-size-problem/
description: Do srcset and <picture> solve the responsive image problems?
created_utc: 2013/09/20 17:03:16
---

Ahead of my contribution to the Responsive Images panel at [Edge Conference in NY](http://edgeconf.com/2013-nyc/) next week, I wanted to get down my thoughts on the topic, if only to see if it differs after the conference. Well, my thoughts along with many discussions and real-world implementations with [my team at Condé Nast Digital UK](http://fromthe7th.com/). Some of the most popular currently proposed solutions are:

  1. srcset extensions to the img element
  2. <picture> element, including multiple <source> definition elements
  3. [A compromise between 1. and 2.](http://www.w3.org/community/respimg/2012/06/18/florians-compromise/)
  4. Client Hints

All of these proposals seem to agree on one thing: that there should be an ability for developers to define different image sources based on the size of the viewport, or the pixel density of the screen. Pixel density because we don't want to upscale images by displaying them at their replaced element's virtual pixel size. Different size of the viewport because we want to have art direction on different size crops of an image.

## This isn't enough

I'd go so far as to say that this may be a destructive place to start. In the case of the `<picture>` element, developers would actually be defining rules for which sources to use at which screen widths, independent of the stylesheets for the page. This is problematic because this disconnect flies in the face of semantic separation, and means we will have a difficult time defining one place where layout is controlled. Consider the scenario where the image has one or both of width and height set to 'auto' (as if they are both set to by default). By defining a different image source at different viewport sizes which has a different pixel size, the image displayed in the replaced element will also change size to match. I recognise that this is *already* a problem with the `<img>` element as it is today (and some may say a welcome feature), even without multiple source/media-query combinations, but in my opinion this is a different level of problem because of the explicit definition of media queries to define rules within the html. The srcset solution is better in that it's still adhering to the current principles of `<img>` and simply providing a way for us to give (what the browser hopes to be) the same image at a larger size.

## Responding to Element Size

But can this be taken one step further? Through CSS, we can alter the user experience of our pages - layout, appearance, transformation, animation, etc. All this can change the positioning and size of our `<img>` elements. To reiterate - it's in the CSS that we define the rules that govern where and how big our images are. The browser should choose an appropriate image source depending on that location. In order to do that, we should give the browser an appropriate list of image sources we have for that element, and explicitly define their width and height. Something like:

```html
<img alt="Barak Obama stands to deliver his speech at the White House">
  <source width="300" height="150" src="" />
  <source width="600" height="300" src="" />
  <source width="1920" height="1280" src="" />
</img>
```

This still adheres to HTML's purpose (which `srcset` does too) of merely defining data in HTML. This has to be the solution to responsive images. In fact it is similar to the solution used by us at Condé Nast UK for *Vogue*, *GQ*, *Wired* and others, albeit a javascript solution (codenamed *'srcTwizzle.js'* at version 1). Consider the following example, where we have a page at 530px and 730px viewport width:

![730px viewport width](../media-a/responsive-images-gq-1.png){.content-image} ***730px viewport width***

![530px viewport width](../media-a/responsive-images-gq-2.png){.content-image} ***530px viewport width***

The CSS is defined to stop floating the list of *latest* articles by 530px (they are on the right at 730px) so that it isn't forming a second column anymore, and the featured images are set to go to fill the space of their containers (100% width). So, at a smaller screen size, we actually have a bigger image. Not a problem for `<picture>` element, one could say, we just define a smaller image for viewports of 730px width than we do for screens of 530px width.... ...**But** consider the scenario that we offer _users_ the ability to remove the 'latest articles' list. And that we have the following css rules:

```css
#FeaturedArticles, #LatestArticles
{
  width:50%;
}
#LatestArticles ~ #FeaturedArticles
{
  width:100%;
}
```

When the `#LatestArticles` list is removed from the DOM, the `#FeaturedArticles` list expands to fill the full-width. Now we have a problem using the `<picture>` element where the image will be upscaled. However, if the browser makes the choice based on the *element size*, and since we've given a width rule to the image element, the most appropriate image source for the size of the element will be chosen. In my experience, we achieve a responsive design by using percentage-based sizing and some media query adjustments. It works well. We should keep doing that, without adding more rules in to make specific changes at specific viewport sizes.

## Problems

  * You have to know the width and height of each image at html generation time. _Though, for the srcset and <picture> solutions you kind of need this too, you're just assuming what width and height the image will be at appropriate screen sizes, and making assumptions about the location / margin / padding, which is worse._
  * Each source has to be the same aspect ratio. _I think we could get around this with by defining a spec about how to define behavior for aspect ratio differences: an optional aspect-ratio-group element for example._
  * Images will be scaled. _It's true that with the `<picture>` proposal, we could define different images for different screen sizes, and the image would be displayed at it's actual pixel size. Our page layout would then adjust accordingly. However, if we are to encourage percentage-based sizing more and more, then unless we're defining fixed widths at different breakpoints, scaling is here to stay._

## Isn't this the same as Element Queries?

[Element Queries aim to solve much the same issue](http://coding.smashingmagazine.com/2013/06/25/media-queries-are-not-the-answer-element-query-polyfill/). The principle guiding the call for Element Queries is that our layouts should be fluid by design. When a layout is fluid, then it's the viewport size which affects the box size and position of an element, along with all the css rules applied to all the elements in the document. And a lot of developers and designers really want is to alter the behaviour of an element (or the content of an element) when the browser has given it a certain size because of those rules. The reason they want this is it becomes cumbersome and messy to keep track of everything changing when using mostly percentage-based sizing, and so designers and developers are pushed towards a strategy of defining various breakpoint widths, and consolidating many fixed-width rules in to those breakpoints instead. In our team, we still like to think about each element's purpose individually and apply responsive behaviour to it in a somewhat componentised fashion, whilst considering the layout as a whole. Helper like SASS get us a long way here, but there are still a lot of real-world scenarios, which having the browser make decisions based on viewport size as a whole forces us in to javascript to solve.
