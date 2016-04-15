front
=====

The front end and **main** repo for modelhub, it is written with [**Angular**](https://angularjs.org/), [**Require**](http://requirejs.org/)
and [**SASS**](http://sass-lang.com/) on the client side with a [**Go**](http://golang.org/) server and [**MySql**](https://www.mysql.com/) database.
The project is configured as a single page web app. The app enables users to create projects, create folder directory structures within each project
and upload any files to those folders. If the file is an image/audio/video format supported by the browser, it should be viewable directly within the browser.
If it is a pdf or open document format file it should be viewable within the browser courtesy of [viewer.js](http://viewerjs.org/) and [pdf.js](https://github.com/mozilla/pdf.js).
If it is a 3D design file supported by the Autodesk [view and data api](https://developer.autodesk.com/api/view-and-data-api/), then it should be automatically translated into a format which can then be viewed
in the browser courtesy of Autodesks [viewer3D.js](https://autodeskviewer.com/viewers/2.5.34/viewer3D.js).

##Setup Checklist

1. Install the following dependencies, the specified version numbers are versions known to work, try the latest available 
   versions at the time of installation, if they don't work fall back to the specified versions. An effort should be made
   to resolve any build issues with the latest dependencies when they arise so the project does not stagnate and fall behind:
    * [MySql](https://www.mysql.com/) v5.7.10
    * [Go](https://golang.org/doc/install) v1.6.1
    * [Node](https://nodejs.org/) v5.0.0

2. Run the `db.sql` script from [`$GOPATH/src/github.com/modelhub/core/sql`](https://github.com/modelhub/core/blob/master/sql/db.sql) on your MySql instance to set up the modelhub db.

3. Run:
    ```sh
    go get github.com/modelhub/front
    cd $GOPATH/src/gihub.com/modelhub/front
    npm install -g grunt-cli
    npm install
    grunt buildServer
    grunt watchSass
    ``` 
    Then open another terminal in the same location and run:
    ```sh
    cd src\server
    ./server.exe
    ```

4. Local request redirection is required, for local development to send `modelhub.autodesk.com` to `127.0.0.1`, this is only required
to enable the openId login flow through the autodesk login portal, modelhub will eventually have its own user accounts and login process. ...eventually.

5. Open a browser and navigate to `modelhub.autodesk.com:8080`, if you're looking at a valid web page congratz, if not, better luck next time.

When pulling latest changes it is not always necessary but probably good practice to follow these steps:

    1. stop the server
    2. run `npm install` to ensure all npm and bower dependencies are present and up to date
    3. restart `watchSass` grunt task
    4. run `buildServer` grunt task in case any server changes have been made
    5. restart the server

##Common Tasks

There is a grunt task to cover all the basic requirements of development, run the following commands as `grunt <cmd>`:

* `buildServer` will build the server and copy the resulting server.exe to `build\server`
* `cleanServer` will delete all generated files from running `buildServer`


* `buildClient` will build the client into `build\client` directory with the concatenated and minified css and js and stripped of the AMD loading code
* `testClient` will run all the client unit tests and drop the results and coverage reports in `test\unit`
* `cleanClientBuild` will delete all generated files from running `buildClient`
* `cleanClientTest` will delete all generated files from running `testClient`


* `buildAll` is a convenience command for `buildServer` and `buildClient`
* `cleanAllBuild` is a convenience command for `cleanServer` and `cleanClientBuild`


* `watchSass` will start node-sass auto compilation of all sass files in the `src\client` directory
* `cleanSass` will delete all **css** files in `src\client`


* `startDevServer` will start the `server.exe` in the `src\server` directory on a unix os
* `winStartDevServer` will start the `server.exe` in the `src\server` directory on a windows os
* `startBuildServer` will start the `server.exe` in the `build\server` directory on a unix os
* `winStartBuildServer` will start the `server.exe` in the `build\server` directory on a windows os


* `updateSeleniumServer` will run `webdriver-manager update`
* `startSeleniumServer` will run `webdriver-manager start`


* `testE2e` will run all the end to end tests and drop the results reports in `test\e2e\results`
* `cleanE2e` will delete all generated files from running `testE2e`


* `nuke` is a convenience command for `cleanAllBuild`, `cleanClientTest`, `cleanSass` and `cleanE2e`

##Component Principles

Components form the central programming pattern/paradigm in the **front** project so it is important to understand how and why
they work as they do:

* Every component has at least 3 files associated with it:
    * `<component-name>.js` - contains the code defining the custom element name and the controller associated with it. The code in this
    file should encapsulate all the necessary behavior for the component to function correctly in any given context.
    * `<component-name>.html` - contains the html defining the structure of the displayed content.
    * `<component-name>.scss` - contains all the styling rules for the components internal structure only. It is important that all the
    rules are nested inside a single parent with the name of the custom element, that way they won't clash with other components.
    The styling rules should also not reach inside any sub components as they should be styled entirely by their own `<component-name>.scss` file,
    for this reason you should also use and abuse the direct child selector `>` as much as possible.
  
* In addition to the mandatory files above, there can be additional files for specific cases, often these are json data files. One common use is for
Internationalization and Localization.
    * `<component-name>.txt.json` - if a component contains static strings (and most do), all of those strings should be extracted out into a `<component-name>.txt.json` file to work with
    the `i18n` service. This enables the component to switch between different supported UI languages on the fly without any further development effort.

##Architecture

###Server

The server is designed such that all requests must pass through [wall](https://gihub.com/modelhub/wall)
first before going on to the [restApi](https://gihub.com/modelhub/rest) where the actual endpoints and request 
handling logic lives. [wall](https://gihub.com/modelhub/wall) performs checks to ensure that the request is
coming from a logged in user, and if not then it will redirect the request to the relevant openid service provider.

###Client

The client is a single page angular web app. It is split into two main pieces, services and components:

####Services 

Services interact with the server, other remote services and 3rd party code on the client. They serve to keep the ui components
independent of server/services/3rd party code.
 
####Components

Components form the bulk of the modelhub front code base, they are implemented as custom angular element directives and create all the UI
within modelhub. See [**Component Principles**](#component-principles) for more info on their structure.

##Coding Guidelines

* Naming - javascript/json property names for both functions and fields should always be camelCase
* Angularjs - angularjs components should be named `cp<component-name>`, angular services should be named `<service-name>`
* Curly braces - opening curly braces are on the end of the existing line and increase the level of indentation on subsequent lines, closing curly braces go on a new line on their own and decrease the level of indentation on subsequent lines and their own line. 
* Html structure - because components are large and often complex structures, the traditional html tags don't provide sufficient vocabulary to define elements by tag name alone and semantic markup is virtually meaningless in such an environment, for this reason only div tags are used for content structure and the purpose of the element is described using css classes to provide more descriptive names to more clearly illustrate the purpose of the element. Html id attributes should never be needed in html tags for styling, in the rare cases where they are needed for third party libs (lmv) they should be dynamically generated in controllers with an incremental version number and interpolated into the html template by angular.
* Dependency injection - When injecting angular controller dependencies, always pass in built in angular services first then custom modelhub services second, both sets of dependencies should be listed in alphabetical order.
* Registry - registry files should list services first then components second, both sets should be listed in alphabetical order.
* Abbreviations and Acronyms -Generally, abbreviations and acronyms are not acceptable in identifiers and names should be written in full. They should only be used in cases where they are commonly accepted in the wider development community (e.g. io, src, tpl, ctrl) and in project specific cases where the identifier is so commonly used and long in length that it is worth making a specific shortened form. This list should be kept up-to-date and short:
   * `cp` - `component`, all custom angular components are defined with their own element name. Since custom element names must
be hyphenated and we have many components, `cp` simply designates the identifier as a custom component.
   * `tpl` - `template`, commonly used in the angular community.
   * `ctrl` - `controller`, commonly used in the angular community.
   * `txt` - `text`, only a slight shortening but so commonly used with the `i18n` service to inject all static strings, and `txt` is commonly used for `text` in a wider context that it is acceptable to use here.
   * `dt` - `datetime`, commonly used in development, and frequently used in the components when rendering dates via the i18n` service.
* General - general guidelines around line length, function size etc are left up to the developers own sensible judgement

##Source Control

Always work within a `feature/<feature-name>` branch even if it is a very minor change, all changes going into develop or master branches should be via a pull request with a formal code review.

##Dev recommendations

[Webstorm](https://www.jetbrains.com/webstorm/) + ExtraPlugins([require.js](https://github.com/Fedott/WebStormRequireJsPlugin), [go](https://github.com/go-lang-plugin-org/go-lang-idea-plugin))