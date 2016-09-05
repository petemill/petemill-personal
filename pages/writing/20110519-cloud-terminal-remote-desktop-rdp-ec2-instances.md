---
title: "Cloud Terminal: Remote Desktop to EC2 instances"
link_previous: http://wishfulcode.com/2011/05/19/cloud-terminal-remote-desktop-rdp-ec2-instances/
description: An app which lets you connect to and search an ever-changing list of AWS servers
created_utc: 2011/05/19 21:24:57
---


**Update**: [CloudTerminal can now be found at GitHub.](http://petemill.github.io/CloudTerminal-win/)

![CloudTerminal logo](../media-a/cloud-terminal.png){.content-image}

When working with connectable resources in the cloud, the number and IP location of those resources can change at any point. A pain point is often managing the addresses with which to connect to these instances, so I spent a short amount of time doing something about it by creating a program in WPF which automatically retrieves a list of instances for an Amazon EC2 account and allows connections over Remote Desktop Protocol (RDP).

![CloudTerminal v0.2](../media-a/cloudconnect.png){.content-image .--screenshot}

After quickly realising then that there are many additional features which would also be useful in this area, I open sourced the project at [http://cloudterminal.codeplex.com](http://cloudterminal.codeplex.com/). Special thanks for contributing a beautiful logo to [James Tenniswood](http://www.tenniswood.co.uk/). To prevent over-engineering the tool and never coming up with a version I can use myself let alone releasing, I decided to put some old-school agile methodology on the project and prioritise the features by how essential they are for each release. This roadmap is then published on CodePlex. Development of features in 0.2 is complete and [a working copy can be installed via click-once](http://cloudterminal.codeplex.com/releases/clickonce).


### 0.1

  - Retrieve and display list of connections from EC2

  - Connect and disconnect via RDP to any instance in list

### 0.2

  - Show instance CPU history

  - Store account keys in local configuration

  - Optimise UX

### 0.3

  - Allow multiple AWS accounts

  - SSH connectivity, including private key storage

  - Overlay instance details / commands on list select

  - Add grid of instances, shown when no connections are active

### 0.4

  - Allow Azure accounts with more appropriate list view of instances/services

### 0.5

  - Test TCP connectivity before connecting. Offer option to open relevant remote cloud firewall port to client IP address.

  - Allow instance / image / service specific credential saving for connections.
