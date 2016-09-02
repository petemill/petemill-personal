---
title: Managing code and configuration synchronisation in an IIS web farm
link_previous: http://wishfulcode.com/2010/06/22/managing-code-and-configuration-synchronisation-in-an-iis-web-farm/
description: Using git to keep code and server configuration synchronised in a cloud environment
created_utc: 2010/06/22 22:34:00
---

When we think about version control, the most common purpose we associate with it is source code.  


When we think about maintaining a farm of web servers, the initial problems to focus on solving are:  


  1. Synchronisation – different nodes in the farm should not (unless explicitly told to) have different configuration or serve different content.  

  2. Horizontal Scalability – I want to be able to add as many servers as required, without needing to spend time setting them up or without new builds taking more time to deploy.  

  3. Reliability – no single point of failure (although this has varying levels – inability to run a new deployment is less severe than inability to serve content to users).   


The scenario begs for a solution involving some kind of repository both of content (ie: runtime code) and configuration (ie: IIS setup), and most sensibly one that asks the member servers in the farm to pull content and configuration from an authoritative source, rather than having to maintain a list of servers to sequentially push to.  


## Synchronising Content  


This sounds very similar to the feature set of many Distributed Version Control Systems. Thanks to [James Freiwirth](http://thecodedecanter.wordpress.com/)'s investigation and code (and persistence!), [we started with a set of commands in a script that would instruct a folder to fetch the latest revision of a set of files under Git version control and update to that revision](http://thecodedecanter.wordpress.com/2010/03/25/one-click-website-deployment-using-teamcity-nant-git-and-powershell/). So now we could have multiple servers pulling from a central Git repository on another server and maintaining the same version between themselves. What's more, by using Git the following features are gained:  


  * It's index-based – Git will fetch a revision and store it in its index **before applying **that revision to the working dir. That means, even on a slow connection, applying changes is very quick – no more half-changed working directory whilst waiting for large files to transfer. FTP, I'm talking to you!  

  * It's optimised – Git will only fetch change deltas, and it's also very good at detecting repeated content in multiple files.  

  * It's distributed – All the history of your runtime code folder will be maintained on each server. If you lose the remote source of the repositories, not only will you not lose the data because the entire history is maintained on each node, you will still be able to push, pull, commit and roll-back between the remaining repositories.  


So you could commit from anywhere to your deployment Git repository, and have all servers in your web farm pick up these changes. And then you instantly gain revision control for all deployments. If you are manually copying files to your deployment environment and, now, to the origin of your repository (some environments can't help this - shock!) you never have to worry about overwriting files you'll later regret, and you're able to see exactly what's changed and when in your server environment. Or, if you have a build server producing your website's runtime code like us, then you can script the build output to be committed to your git (using NANT for example). James is a member of my development team, and he really changed the way we think about DVCS by introducing us to Git quite early on.  



![](http://4.bp.blogspot.com/_gYxqdqw9RN8/TCEgmoRKdMI/AAAAAAAAByA/-wsQrkcMKtg/s320/gitdeploy-buildoutput.JPG)  


## Synchronising IIS  


Maintaining web server configuration across all servers is just as important as being able to synchronise content. In the past, options were limited. With IIS7 we gain the ability to store a very semantic and realtime representation of IIS configuration on any file path with the Shared Configuration feature. If we can somehow still store this information locally, but have it synchronised across all the servers then we are satisfying all 3 requirements for synchronisation, scalability and reliability.  

To accomplish this, we can use the exact same method for synchronising IIS configuration that we use for content. We can set up a git repository, put in the IIS configuration, pull this down to each server and instruct each server's IIS to point to the working copy of the revision control repository. Then, we now have history, comments and rollback ability for IIS configuration. Being able to see each IIS configuration change difference is alone an incredibly invaluable feature for our multi-site environment.  



![](http://wishfulcode.files.wordpress.com/2010/06/gitdeploy-iis.jpg?w=300)   


## Practical setup (on Amazon EC2)  


The final task to accomplish is to identify what process runs on all the servers to keep them always pulling the latest version of both the content and the configuration. The best we've used so far is simple Windows 2008 Task Scheduler powershell scripts, which James gives examples of. **However, these scripts themselves **can change over time since they need to know which repositories to synchronise. This calls for yet another revision controlled repository. The scheduled tasks on the servers themselves are only running stub files which define a key, to identify which farm, and therefore which sites a server needs, and then runs another powershell script retrieved from a central git repository which ensures the correct content repositories for that farm are created and up to date.  


The end result is a completely autonomous (for their runtime) set of web servers, which call to central repositories in order to seek updated content and configuration.   


If we then create a virtualised image with a Scheduled Task running the stub powershell script, we have the ability at any time to increase the capacity of a server farm simply by starting new servers and pointing the traffic at them. These new servers will each pull in the latest configuration and content.  


## Why not use the MS Web Deploy Tool?  


Microsoft's Road Map for IIS and ASP.Net [includes interesting projects concerning deployment and server farm management](http://blogs.iis.net/msdeploy/archive/2008/01/22/welcome-to-the-web-deployment-team-blog.aspx). The Web Deploy tools is impressive in that in can synchronise IIS configuration and content (and some other server setup) even between IIS versions. However, it is very _package_ based. We'd still need a system to either pull the latest version package down to each local server and perform a deployment of the package, or remotely push to every server we know about. This essentially starts us back at the same step I defined at the beginning of this post – needing a way to maintain a farm of servers and building something to manage the execution of those packages. There are scenarios where I do use this tool, and I'm sure that this and other tools will evolve to the point where we can get as much control and flexibility as we can achieve with 'git-deploy' quite soon.
