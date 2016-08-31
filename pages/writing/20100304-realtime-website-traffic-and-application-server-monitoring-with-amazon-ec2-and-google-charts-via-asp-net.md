---
title: Realtime website traffic and application server monitoring with Amazon EC2 and Google Charts (via ASP.net)
link_previous: http://wishfulcode.com/2010/03/04/realtime-website-traffic-and-application-server-monitoring-with-amazon-ec2-and-google-charts-via-asp-net/
description:
created_utc: 2010/03/04 20:39:00
---

Software products which analyse web site traffic patterns, like Google Analytics, are awesome. But they only measure client data and most of them do not provide realtime data. Server geeks like me have an in-built desire to see how much actual traffic is passing through web servers, **and how the machines powering your application are performing**. If your servers are in [Amazon's EC2](http://aws.amazon.com/ec2) environment, then [CloudWatch](http://aws.amazon.com/cloudwatch/) can provide statistics on CPU, I/O and Network via a web service call.

[The web service is quite complicated](http://docs.amazonwebservices.com/AmazonCloudWatch/latest/DeveloperGuide/), but in simple terms you can provide a start date and end date, the period of each statistic and whether you want an average, maximum, minimum or sum from each period, as well as the metric you want to look at. For CPU, you likely want to take an average of a minute (will return 1440 data-points for a 24hr period - the maximum the web service will allow), or 10 minutes (a more manageable 140 data-points). The data is available for 14 days. ![](http://2.bp.blogspot.com/_gYxqdqw9RN8/S4_7rAesciI/AAAAAAAABwo/LuJJmaK6sLI/s320/screenshot-cloudwatch-googlecharts-load-balancer-monitoring.gif)

But how to make this data comprehensible? Enter [Google Charts](http://code.google.com/apis/charttools/) which, through their [simple client-side API](http://code.google.com/apis/visualization/documentation/gallery/annotatedtimeline.html#Example), provides a great way  to visualise this data.

When working with any statistical data sets, but especially with realtime data, it's good to have some data to compare to. Most useful in this situation is to have everything for the **current day** so far, then everything for **yesterday** (so we always have more than 24hrs worth of recent data), and then the data from the **same day in the previous week**. This way we can see at a glance if we're in a traffic or performance peak. In the demo page I've built (see screenshot), I retrieve all the load balancers on an AWS account, and for each one display both the request traffic history, and the CPU history for each server in the load-balanced farm. The code for this comes in three parts:

  1. Getting the data from CloudWatch (.net c#).
  2. Converting (and combining) the data to something we can pass to the front-end (JSON in this case).
  3. Calling the charts API in javascript with the data and configuration for each graph.

This test code could be labeled the 'TodayYesterdayLastWeek' demo, and you'll probably see why that's hard-coded in the code below. The C# code is fairly generic, and a class library could probably be made from it to wrap the rather complicated AWS SDK. In that it will take single or multiple days, and the required metrics as parameters, and retrieve the necessary simple data-points from CloudWatch:
```
protected static IEnumerable<IEnumerable<DataPoint>> GetLoadBalancerDataMultipleTimeSpans(string loadBalancerName, params DateTime[] days)
{
  return days.Select(day => Get24HrPeriodRequestCountForELB(loadBalancerName, day, true, AnalyticsValueType.Sum));
}

public static IEnumerable<DataPoint> Get24HrPeriodRequestCountForELB(string loadBalancerName, DateTime day, bool onlyTime, AnalyticsValueType valueType)
{
  DateTime start = new DateTime(day.Year, day.Month, day.Day, 0, 0, 0);
  DateTime end = start.AddDays(01);
  var stats = CloudWatchClient.GetMetricStatistics( new GetMetricStatisticsRequest()
    .WithStatistics(new[] { "Sum" }) //get me the sum
    .WithStartTime(start.ToString("s")) //from 1 hour ago
    .WithEndTime(end.ToString("s")) //until now
    .WithDimensions( //with load-balancer name x as dimension
      new Dimension().WithName(CloudWatchDefaultDimensionsELB.LoadBalancerName.ToString()).WithValue(loadBalancerName)
    )
    .WithMeasureName(CloudWatchDefaultMetricELB.RequestCount.ToString()) //for the request count
    .WithPeriod(600) //per x seconds
    .WithNamespace("AWS/ELB")
  );
  return ToDataPoints(stats, onlyTime, valueType);
}
```

Then, in the ASP.Net code, we can call these methods and output the results to the page, passing the data through to our `LoadTodayYesterdayLastWeekRequestChart` javascript function:
```
<% foreach (var loadBalancer in LoadBalancers)
{
  var containerId = "RequestsDaily" + loadBalancer.LoadBalancerName;
%>
  <!-- request chart-->
  <div style="width:640px;float:left;margin-left:20px;">
    <div style="width: 640px; height: 250px;" id="<%=containerId %>">
      <!-- requests chart -->
    </div>
    <!-- cpu charts -->
    <div style="">
      <% foreach (var instance in loadBalancer.Instances)
      {
        var instanceContainerId = "CPUDaily_" \+ loadBalancer.LoadBalancerName + "_" \+ instance.InstanceId;
      %>
        <div id="<%=instanceContainerId %>" style="width:300px;margin-left:10px;height:140px;float:left;">
          <!-- instance cpu chart -->
        </div>
        <!-- requests instance cpu client data -->
        <script type="text/javascript">
          LoadTodayYesterdayLastWeekCPUChart("<%=instance.InstanceId %>","<%=instanceContainerId %>" , [ <%= ToGoogleChartDatedDataTableRows( GetCPUDataMultipleTimeSpans( instance.InstanceId, DateTime.Now, DateTime.Now.AddDays(-01), DateTime.Now.AddDays(-07) ) ) %> ]);
        </script>
      <%} %>
    </div>
    <!-- requests client data -->
    <script type="text/javascript">
      LoadTodayYesterdayLastWeekRequestChart("<%=loadBalancer.LoadBalancerName %> requests","<%=containerId %>",[ <%= ToGoogleChartDatedDataTableRows( GetLoadBalancerDataMultipleTimeSpans( loadBalancer.LoadBalancerName, DateTime.Now, DateTime.Now.AddDays(-01), DateTime.Now.AddDays(-07) ) ) %> ]);
    </script>
    <!-- end data -->
  </div>
<%} %>
```

If you built this in to an intranet template (which I've done to give the other teams visibility on their sites) you could add other servers with CloudWatch that are integral to your app, and maybe even add client-side data refreshing and the [google-o-meter](http://code.google.com/apis/chart/docs/gallery/googleometer_chart.html) to give a quick red/green status update:


![](http://chart.apis.google.com/chart?chs=600x300&cht=gom&chd=t:70&chco=FF0000,FF8040,FFFF00,00FF00,00FFFF,0000FF,800080&chxt=x,y&chxl=0:%7C10,000,000%20users%7C1:%7Clow%7Chigh%7Cspike)

Since we’re getting results to compare today’s traffic to, we could build up some expected averages and working out wether we’re in the low/high/spike traffic zones.

I should point out that there are a lot of great tools out there to manage your EC2 servers and analyse CloudWatch data. I personally love Ylastic as a way to share server tagging and management within a team. I created this tool as a way for my team to be able to view production statistics condensed and at-a-glance.

[Download the sample code for this here](http://pete-share.s3.amazonaws.com/blog/Monitoring-AWS.zip). Be sure to change the configuration key/value lookup to whatever source you want – I used a CMS template to provide the data: Umbraco.

## Comments

**[Prabhakar Chaganti](#3 "2010-03-05 01:05:22"):** Nice post!

**[rjhintz](#1048 "2015-02-09 03:30:04"):** Is this on GitHub?
