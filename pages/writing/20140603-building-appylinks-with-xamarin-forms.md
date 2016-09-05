---
title: Building AppyLinks with Xamarin.Forms
link_previous: http://wishfulcode.com/2014/06/03/building-appylinks-with-xamarin-forms/
description: Investigating rapid cross-platform iOS and Android development
created_utc: 2014/06/03 01:54:22
---

#### Update

*This was a weekend project as my entry for the Xamarin Forms Evolve conference competition. ...and [I won first prize](http://blog.xamarin.com/xamarin.forms-contest-winners/)!*



Code: [https://github.com/petemill/AppyLinks]()

The new _Xamarin.Forms_ release is  pretty interesting. I spent a day exploring it and decided to build an app that I've personally seen a need for - quick way to get a list of links I may be working on to multiple devices.


Day to day my team and I have to **preview a lot of different (_and long_) urls on devices**, for both when we're building and when we're presenting, so an app that can display a list of those links across devices would be quite handy!

I decided to use a user's GitHub gist as the data store since it allows for easy and continuous editing, and therefore authenticate the app using GitHub.  In the past, I've tried to use Xamarin Studio to create basic tools like this for both iOS and Android. Aside from some professionally-released apps, I've always stopped before having something coherent because I just could not get enough accomplished in a few hours - there was just too much overhead, and too much having to get to know the intricacies of each platform. The fact that I did get this done in a day, and that it did (for the most part!) 'just work' on both iOS and Android is proof that the new Xamarin.Forms is going to be incredibly useful. And this is only their first release...

![](http://wishfulcode.files.wordpress.com/2014/06/appylinkslogo.png){.content-image .--tiny}

AppyLinks lets you authenticate with github...

![Logging in via GitHub](http://wishfulcode.files.wordpress.com/2014/06/screenshot-2014-06-03-01-26-56.png){.content-image}

...from where it will grab a gist named 'AppyLinks' from your account and parse the basic list of links it expects...

![List of links retrieved from a GitHub gist](http://wishfulcode.files.wordpress.com/2014/06/screenshot-2014-06-03-01-27-49.png){.content-image}

...Selecting any of the links will open a view with a browser navigated to the destination, and allow you to navigate back to the list.

![Opening a link in a WebView](http://wishfulcode.files.wordpress.com/2014/06/screenshot-2014-06-03-01-28-17.png){.content-image}

Source code is public and available on GitHub at [https://github.com/petemill/AppyLinks]().

### The power of the new Xamarin.Forms

A typical view, which will render with native controls on iOS, Android and Windows Phone:

```xaml
<ContentPage
    xmlns="http://xamarin.com/schemas/2014/forms"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="AppyLinks.LinkList"
       Title="AppyLinks"
    >
    <StackLayout Orientation="Vertical">
        <ActivityIndicator x:Name="listFetchingActivity" IsRunning="false" IsVisible="false"></ActivityIndicator>
        <ListView x:Name="urlView"
        IsVisible="true"
        ItemSelected="ItemSelected">

        <ListView.ItemTemplate>
          <DataTemplate>
                  <TextCell Text="{Binding Title}" />
          </DataTemplate>
        </ListView.ItemTemplate>
      </ListView>

    </StackLayout>
</ContentPage>
```

An interface to device-specific local-storage...

```csharp
public interface IUserSettingsStore
{
    string GithubAuthorizationToken { get; set; }
}
```

...the implementation for android...

```csharp
public class UserSettingsStore : IUserSettingsStore
{
    //static control
    static AndroidSettingsStore preferencesInstance = null;
    public static void Init(Context settingsContext)
    {
        //initialise preference store
        preferencesInstance = new AndroidSettingsStore(
            PreferenceManager.GetDefaultSharedPreferences (settingsContext)
        );
    }

    const string SETTINGSKEY_GITHUBAUTHTOKEN = "GithubAuthToken";

    //interface implementation
    public string GithubAuthorizationToken {
        get {
            return preferencesInstance.androidPreferences.GetString (SETTINGSKEY_GITHUBAUTHTOKEN, null);
        }
        set {
            var editor = preferencesInstance.androidPreferences.Edit ();
            editor.PutString (SETTINGSKEY_GITHUBAUTHTOKEN, value);
            editor.Apply ();
        }
    }
        
    public UserSettingsStore ()
    {
    }
}
```

...and for iOS...

```csharp
public class UserSettingsStore : IUserSettingsStore
{
    const string SETTINGSKEY_GITHUBAUTHTOKEN = "GithubAuthToken";

    #region IUserSettingsStore implementation

    public string GithubAuthorizationToken {
        get {
            return NSUserDefaults.StandardUserDefaults.StringForKey (SETTINGSKEY_GITHUBAUTHTOKEN);
        }
        set {
            NSUserDefaults.StandardUserDefaults.SetString (value, SETTINGSKEY_GITHUBAUTHTOKEN);
        }
    }

    #endregion

    public UserSettingsStore ()
    {
    }
}
```

### Great things about Xamarin.Forms

  * You can make custom render implementations for each platform - for whole controls, or just to customise a small part of functionality - see the custom `NavigationPageRenderer` for iOS in AppyLinks source code.
  * You can provide Interfaces, and make an implementation on each platform, if you want to do platform-specific.
  * Each platform still has a separate project which can be completely customised or configured - Xamarin.Forms doesn't enforce some kind of purist approach.

### Challenges with v1

  * No designer, even though there's both XAML support here, and there's the nice new iOS designer with Xamarin. Because of the spaghetti c# view code, I daren't add any (even basic) styling to these views with any speed, and that's a shame (especially on android).
  * Xamarin Studio is having problems with intellisense and syntax highlighting for objects defined in XAML.
  * It's an early release, so documentation is pretty bare, and also quite ambiguous at times.
  * There are currently some issues with `System.Net.Http` (probably affecting all mono uses, there's a bug report from 2013 I commented on here).
  * Couldn't get the XAML `<FileImageSource />` element working, had to fallback to the `Image.Source = ImageSource.FromFile` pattern, which did work fine once you import the image file as a resource in to each platform-specific project.

With this new ability mixed with Portable Class Libraries (like Octokit.net) you really can get to the stage where projects are 95% shared code, and the 5% platform-specific is finessing the details, rather than re-implementing the same logic! Awesome logo designed by the lovely [Kat Windley](https://twitter.com/katintheback)!
