---
title: ASP.Net Routing and virtual article-based extensionless website Urls
link_previous: http://wishfulcode.com/2010/09/19/asp-net-routing-and-virtual-article-based-extensionless-website-urls/
description:
created_utc: 2010/09/19 22:42:00
---

There is an architectural difficulty in relating the new ASP.Net penchant for _functionaly_ semantic Url patterns using [ASP.Net Routing](http://msdn.microsoft.com/en-us/library/cc668201.aspx) with sites whose Url patterns are _editorially_ semantic. That is, the patterns match various sections of a site, which may all be functionally very similar and so should be routed to the same handling code for an appropriate view to be returned. My team were faced with this dilemma earlier this year whilst developing the <http://www.glamourmagazine.co.uk> site. This is a site whose content is stored in [Umbraco](http://umbraco.org/), so has an editorial tree of >50,000 articles, each with a differing template choice. For this site, we wrote our own data reading and rendering API on top of ASP.Net, bypassing the Umbraco API.

The difficulty with using older methods to route extensionless requests to ASP.Net (and then to custom IHttpHandlers) is that once the pipeline has handed off to an ASP.Net handler, it’s difficult to get back to another IIS handler. An example of this is requests which should result in IIS finding the default document for a directory. Once we are directing all extensionless requests to ASP.Net, if our ASP.Net handler can’t continue (because maybe an article or aspx page at the virtual path does not exist), then ASP.Net will simply throw an error and display the error page configured in the Custom Errors section in the web.config. This is why still today there are two places to configure error pages, one for the ASP.Net handler, and one for IIS.

## UrlRoutingModule,Catch-All Parameters, IRouteHandler and IRouteConstraint

Traditionally, under ASP.Net routing if you want to set up a route, you need to know roughly how many Url segments to expect, and what the pattern should be. The problem on a site like Glamour is that there will be a varying level of Url segments, as defined by a team of editors at runtime to match the editorial layout of the site. Furthermore, the url pattern of articles is mostly irrelevant to the code.

ASP.Net Routing comes configured when you start an MVC site in Visual Studio, but if you already have an ASP.Net site you can start using ASP.Net Routing without affecting anything else by including the following module in the web.config: `<add name="UrlRoutingModule" type="System.Web.Routing.UrlRoutingModule, System.Web, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" />` and adding the normal route registration in the global.asax (or your site’s application class):

```csharp
protected override void Application_OnStart(object sender, EventArgs e)
{
  base.Application_OnStart(sender, e);
  // Set up custom routing (e.g. MVC Controllers)
  RegisterRoutes(RouteTable.Routes);
}

public static void RegisterRoutes(RouteCollection routes)
{
  routes.IgnoreRoute("{resource}.axd/{*pathInfo}"); routes.IgnoreRoute("{resource}.aspx/{*pathInfo}");
}
```

Adding a new route, with a **catch-all parameter** in its Url pattern (ie: all Urls will route to the rule), in conjunction with a RouteConstraint and placing this rule **after** all other rules (in case we actually want to use MVC or other routes) will accomplish routing all urls to our handler for articles. This class (`EditorialRouteHandler` below) inherits from `IRouteHandler`, and should implement the `GetHttpHandler` which must return an `IHttpHandler`. In our case we are simply returning a `System.Web.UI.Page`, setting its master-page file to be that set in the *Umbraco* data-store, and its data to be the `Node` retrieved from the CMS:

```csharp
//create a route for pages in editorial tree
var editorialPageRouter = new Route(
    "{*page}", //catch-all page parameter
    new EditorialRouteHandler() //handler
  );
//add it to RouteCollection
routes.Add("EditorialPageRouter", editorialPageRouter);
```

The final step is to add a Route Constraint to the rule. This allows the handler to tell the system that it has not found a match for the Url, and that processing can continue to another rule, or back to IIS. This is accomplished by implementing the interface `IRouteConstraint` and implementing the `Match` method which only needs to return a `boolean` specifying whether the specified URL matches the purpose of the rule:

```csharp
//add a constraint that the page must exist in the cms, or we don't route
editorialPageRouter.Constraints = new RouteValueDictionary();
editorialPageRouter.Constraints.Add("EditorialPageFoundConstraint", new EditorialRouteHandler());
```

The following is a sample class which implements `IRouteHandler` and `IRouteConstraint` and returns a `System.Web.UI.Page` if a match is found. If you want to follow this pattern, you’ll need to implement the mechanism for retrieving the data and the master-page appropriate for the URL specified:

```csharp
public class EditorialRouteHandler : IRouteHandler//, IRouteConstraint
{

  public System.Web.IHttpHandler GetHttpHandler(RequestContext requestContext)
  {
    //we should not be here if we have not found a result, and set it
    if (EditorialPageContext.Current.CurrentNode == null)
      throw new Exception("Editorial Node Not Set. Ensure the correct EditorialRouteHandler Route Constraint has been set.");
    //create a new page object, and change the masterpage
    Page pageResult = new Page
    {
      AppRelativeVirtualPath = "~/fake.ashx", //this must be set to something irrelevant to fix a bug in ASP.Net
      MasterPageFile = "my-master-page.master" //set this to a value retreived from your CMS
    };
    //return page with new masterpage
    return pageResult;
  }

  protected virtual string GetTemplatePath(INode node)
  {
    //todo: search data-store for master page path for current data
  }

  protected virtual string GetNodeByUrl(string virtualPath)
  {
    //todo: search data-store for data with given url
  }

  public bool Match(System.Web.HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
  {
    if (!values.ContainsKey("page"))
      return false;
    // get virtual path (null means there was no value for page, meaning it is the domain without a path)
    string virtualPath = (values["page"] ?? "/").ToString();
    // case insensitive
    virtualPath = virtualPath.ToLowerInvariant();
    var currentNode = GetNodeByUrl(virtualPath);
    //if we get a result, build a page up and set the current node
    if (currentNode != null)
    {
      //set current node on the context, could be HttpContext
      EditorialPageContext.Current.CurrentNode = currentNode;
      //inform routing that we have found a result
      return true;
    }
    //inform routing we have not found a result
    return false;
  }
}
```

## Final Tip
If you turn off `RunAllManagedModulesForAllRequests` in IIS’ web.config, you will make sure that the route only gets called for extensionless URLs, and not URLs which should be handled by something else in IIS (even if the file does not exist). However, in most cases, you must [install hotfix 980368 from Microsoft to allow handlers to be called for Urls without extensions](http://support.microsoft.com/kb/980368).
