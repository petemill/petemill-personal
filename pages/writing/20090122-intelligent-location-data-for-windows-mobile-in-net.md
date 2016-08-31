---
title: Intelligent location data for Windows Mobile in .NET
description:
created_utc: 2009/01/22 21:04:00
---

The Windows Mobile API exposes a GPS Intermediate Driver (<http://msdn.microsoft.com/en-gb/library/bb158708.aspx>) which can be used through managed code to access any connected GPS-device data by multiple programs at the same time. Some developers however want their programs to be able to access location data without having to force the user to keep the GPS device on as doing so can consume a lot of power. Google Maps does this by sending your currently connected mobile network cell tower ID to Google’s servers which then send back that tower’s position (looked up in national databases).

It’s not exact at all, but this level of precision may be enough for your application, and if it’s the type of application that’s designed to be run for extended periods of time then this kind of solution will ensure your user won’t run out of battery in just a couple of hours. An article at codeproject.com details reverse-engineering Google’s protocol and provides the C# code to use it: <http://www.codeproject.com/KB/mobile/DeepCast.aspx>  

The best option for a location-aware application is to combine both - use the GPS when the user explicitly asks to (or another application is already using it) and use cell tower-based location data the rest of the time. This paves the way for .net programs on windows mobile to remain permanently connected to location data, and to be more intelligent about it.
