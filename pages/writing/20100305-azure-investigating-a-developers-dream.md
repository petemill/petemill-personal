---
title: "Azure: Investigating a developer's dream"
link_previous: http://wishfulcode.com/2010/03/05/azure-investigating-a-developers-dream/
description:
created_utc: 2010/03/05 02:39:00
---

In 2009, we decided we had to leave our current hosting contract and find a new provider. I started looking at alternatives to the traditional multi-year hosting contracts that had held us back at [Condé Nast Digital](http://www.condenast.co.uk/) for years, and in May I decided to test out if the myths about Amazon EC2 were true. Yes, it really did give you servers (windows in our case) at the click of a button... with a GUI and everything. The flexibility won me over, and the stability meant I couldn't turn back. By October we had moved our entire 15+ site portfolio to Amazon, serving millions of pages each day. And the first server I switched on is still running...  

I quickly learnt that in order to benefit from the cloud (and by that, we mean Amazon's extensive data-centers and redundancy services) we had to move as many components of our applications as possible to the services provided by Amazon. So we moved all of our digital assets to the storage service, and we introduced our high-traffic sites to elastic load-balancing (instead of running our own HAProxy instance, which we're still doing for smaller sites).  

At the end of the day though, these are all, by definition, simple services which still require you to not only manage the code and configuration of your application layer, but also manage the running and reliability of the server environment. As fun as that is (and no I'm not being sarcastic, I'm a geek) it takes up a lot of time when all I really want to be focusing on is developing new apps.  



![](../media-a/screenshot-azure1.png){.--small}

In steps [Azure](http://www.microsoft.com/windowsazure/), which offers a fully managed scalable environment for an application - be it a website, web service, or task worker. It seems that it's reached a level of maturity where a middle ground has been achieved offering enough compatibility to ensure that if an app is following today's best practices, it'll most likely work on the Azure platform. The methodology is a little different - you set up applications as roles, and then configure instances to run those roles on. The c[onfiguration let's you select server capabilities and whether you want local, NTFS-compatible instance storage](http://msdn.microsoft.com/en-us/library/ee758711.aspx).  






For someone who believes in the .net way of doing things, Azure sounds very comprehensive and exciting - being able to write both windows-service-style apps as well as websites, and have a very quick time from coding to large-scale deployment. **As I investigate using Azure within a production development team for high-traffic sites, I'll be posting a series of best practices I find along the way**, hopefully involving:  


  * Which apps will and won't work in Azure, and creative ways we can get around any which won't.
  * What the best migration plan is for existing code and data.
  * How to effectively deploy: integration with development, build and staging processes. (We've only just completed putting in a great deployment process for our sites on windows on EC2, but hopefully the lessons learnt here will be transferrable.)
As it turns out, [there's a rumour going around that RDP access will be enabled for Azure instances](http://searchcloudcomputing.techtarget.com/news/article/0,289142,sid201_gci1380654,00.html?track=sy1260). I'm guessing (and hoping) though, that given how managed the Azure guest operating systems are at the moment, that even if this is enabled there will still be a big element of self-management within the platform.  



![](../media-a/screenshot-azure-management1.png){.--small}

The killer feature will be whether not only is there enough of a management API to match something like Amazon's, where you can for example turn hosting services on or off, but whether you can also use an API to fully manage your application's lifecycle including deployment and scalability. [It does look like the potential is there...](http://msdn.microsoft.com/en-us/library/ee460813.aspx)
