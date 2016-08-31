---
title: Amazon EC2 - Ephemeral storage on EBS-backed instances
description: Running a windows instance on EC2 with both EBS non-EBS instance storage disks
link_previous: http://wishfulcode.com/2010/02/02/amazon-ec2-ephemeral-storage-on-ebs-backed-instances/
created_utc: 2010/02/02 20:01:00
---

In the past, EC2 virtual instances were started only from a machine image stored on [S3, Amazon's distributed object storage platform](http://aws.amazon.com/s3). In this model, instance storage is allocated to a new instance and the image is copied to the instance's main instance storage device. In addition, you get a few extra storage devices depending on the instance type. The trouble is that whilst the instance may be given a lot of this instance storage, it is ephemeral - meaning that once you terminate the instance (or it experiences a failure), the data stored is permanently lost. Data that needs peristance is therefore usually stored by a user on S3, or by creating a disk from [EBS, Amazon's block-level peristent (but not distributed) storage platform](http://aws.amazon.com/ebs/). [Recently Amazon added the option to start an image from a copy of any EBS volume](http://aws.typepad.com/aws/2009/12/new-amazon-ec2-feature-boot-from-elastic-block-store.html). Not only does this allow larger images (and therefore the introduction of Windows Server 2008) but, since the storage is persistent, instances can be stopped or started at will and the data will keep its state.

However, whilst Amazon's command line utilities support it, very few GUI tools (including Amazon's own web console) expose the ability to start an EBS-backed instance which **also has it's normal instance-store disks**. These disks are actually very useful for scenarios where an application requires a large amount of temporary storage which you don't want to have to pay for, or worry about volume management with the rest of your EBS volumes. [The documentation for the command line also lacks a good explanation for how to do this for Windows servers](http://docs.amazonwebservices.com/AWSEC2/2009-11-30/CommandLineReference/).

After some trial and error, I have found that these commands will work nicely:
 - Start a c1.medium instance from an EBS-backed private image including 1 ephemeral disk:
 `ec2-run-instances ami-4bebc03f -k myinstancekey -g my-security-group -b "xvdg=ephemeral0" -t c1.medium --availability-zone eu-west-1a`
 - Start an m1.xlarge instance from an EBS-backed amazon image including 3 ephemeral disks:
 `ec2-run-instances ami-93ebc0e7 -k myinstancekey -g my-security-group -b "xvdg=ephemeral0" -b "xvdh=ephemeral1" -b "xvdi=ephemeral2" -t m1.xlarge --availability-zone eu-west-1a`

![Screenshot of ec2 ephemeral disks displayed as attached in windows explorer](../media-a/windows-ec2-instance-disks.png)

When constructing these commands, you still need to know [how many instance disks are available to each instance type](http://aws.amazon.com/ec2/instance-types/), and what the windows device names are that you can attach them to ([apparently limited to 10: xvdh through xvdp](http://developer.amazonwebservices.com/connect/message.jspa?messageID=158649)).
