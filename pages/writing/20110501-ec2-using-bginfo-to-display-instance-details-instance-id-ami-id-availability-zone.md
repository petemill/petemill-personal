---
title: "EC2: Using BGINFO to display Instance Details"
link_previous: http://wishfulcode.com/2011/05/01/ec2-using-bginfo-to-display-instance-details-instance-id-ami-id-availability-zone/
description: Show the Instance-Id, AMI Id, and Availability Zone on windows server desktop
created_utc: 2011/05/01 21:08:00
---

Yes, [the BgInfo tool](http://technet.microsoft.com/en-gb/sysinternals/bb897557) is a little dated, but it can be useful in situations where multiple servers are being used all with very similar configurations (as should be the case for servers running from an Amazon EC2 image). Any AWS EC2 instance is available to query information about itself using simple GET requests to the [REST metadata service](http://docs.amazonwebservices.com/AWSEC2/2008-08-08/DeveloperGuide/index.html?AESDG-chapter-instancedata.html) at http://169.254.169.254/

## Add Instance Metadata to Environment Variables with Powershell

![](../media-a/setup-task-ec2-env-vars.png){.content-image}

We can write a simple powershell script which fetches various pieces of this metadata and writes it to the Windows Environment Variables (at the machine level). We can then have Task Scheduler run this script at Machine Startup so that each new instance of our image will write its unique data.

```powershell
$wc = new-object System.Net.WebClient;
$instanceIdResult = $wc.DownloadString("http://169.254.169.254/latest/meta-data/instance-id")
$instanceAZResult = $wc.DownloadString("http://169.254.169.254/latest/meta-data/placement/availability-zone")
$instanceAMIResult = $wc.DownloadString("http://169.254.169.254/latest/meta-data/ami-id")
[Environment]::SetEnvironmentVariable("EC2-InstanceId", "$instanceIdResult", "Machine")
[Environment]::SetEnvironmentVariable("EC2-InstanceAZ", "$instanceAZResult", "Machine")
[Environment]::SetEnvironmentVariable("EC2-InstanceAMI", "$instanceAMIResult", "Machine")
```

Now that we have our data, we can configure BgInfo to use it, adding a few custom fields.

![](../media-a/bginfo-user-defined-fields.png){.content-image}

## Configuring a Machine Image to use BgInfo

In order to successfully configure BgInfo for an Amazon Windows AMI so that each RDP user receives the custom background image, I performed the following steps:


 1. Save BgInfo.exe to a permanent folder accessible to all users on C

 2. Run BgInfo.exe and configure data layout as desired

 3. Under Bitmap > Location... select "User's temporary files directory"

 4. Apply

 5. File > Save As... and save the configuration to a file in the same location as bginfo.exe (eg: bginfo.bgi)

 6. Add the following Registry value: `reg add HKU\\.DEFAULT\Software\Sysinternals\BGInfo /v EulaAccepted /t REG_DWORD /d 1 /f`

 7. Create a batch file in the same location with runs bginfo.exe against the saved configuration, with no GUI: `bginfo.exe bginfo.bgi /timer:0 /NOLICPROMPT`

 8. Create a task in Task Scheduler with the following properties:

     - Run only when user is logged on

     - Trigger: At log on (and repeat as desired)

     - Action: Execute the batch file, starting in the relevant directory


And that's it - every time you log-in, under any account, you should see the BgInfo background with the custom EC2 variables:

![](../media-a/bginfo-ec2-instance-info.png)
