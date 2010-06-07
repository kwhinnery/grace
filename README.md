# Grace Framework

Grace is a lightweight, RESTful web application framework for Java and JavaScript.
By embedding the powerful [Rhino](http://www.mozilla.org/rhino/) JavaScript engine for the JVM,
Grace Framework implements a JavaScript web application framework inspired by great projects like
[Ruby on Rails](http://www.rubyonrails.org) and [Sinatra](http://www.sinatrarb.com).  Rhino also
allows JavaScript developers to script actual Java classes, so they can take advantage of all the
powerful libraries available for the Java programming language.  Grace has been tested on and is
intended for use on Google App Engine, but any servlet environment should suffice.

Grace Framework is licensed under the [Apache 2.0 Open Source License](http://www.apache.org/licenses/LICENSE-2.0).

## Installation and Setup

Unzip `grace-<version>.zip` to your servlet context root - if you have existing configuration in 
WEB-INF/web.xml or WEB-INF/appengine-web.xml, you will need to hand merge those files.  Configuration 
is pretty simple - you will need to add the following to web.xml:

	<servlet>
		<servlet-name>Grace</servlet-name>
		<servlet-class>com.grace.GraceServlet</servlet-class>
	</servlet>
	
	<servlet-mapping>
		<servlet-name>Grace</servlet-name>
		<url-pattern>/*</url-pattern>
	</servlet-mapping>
	
And will probably want to add the following in appengine-web.xml:

	<static-files>
		<exclude path="/grace/**.*"/>
	</static-files>
	
Grace has a very small number of dependencies in terms of Java libraries - the hope is to keep Grace
as self-contained as is reasonably possible.  To date, `grace-<version>.jar` has three dependencies, which
must be included in the WEB-INF/lib directory of your servlet application along with `grace-<version>.jar`:

* js.jar (Rhino JavaScript interpreter)
* jackson-core-asl-<version>.jar (super fast Java JSON library)
* jackson-mapper-asl-<version>.jar (super fast Java JSON library)

## Getting Started

A Grace application's JavaScript source is located in `<context-root>/grace`.  In this directory, you will find
`app.js`, which serves as the entry point to your application.  The Grace Framework its self is located
in `grace/framework`, so don't touch the contents of that directory unless you know what you're doing!  
Scripts are also auto-loaded, in order, from the following directories (if present - these directories
are not required):

* grace/lib
* grace/helpers
* grace/models
* grace/controllers

`app.js` can be used to bootstrap (or implement) your application.  Here's an example of the smallest
possible Grace web application:

	grace.resource("/", function(params) {
		grace.render("Hello World!");
	});

## Developers

Development for Grace is facilitated with Eclipse (I'm using 3.5) and the Google Plug-In for Eclipse.
Import the `grace` subdirectory as a Google Web Application Project and start the App Engine server to run Grace
and the test application.  To build Grace distribution packages and run the automated test suite, you
will need to have Ruby, Rake, and the following gems installed:

* rspec
* mechanize (nokogiri is a prerequisite for mechanize)
* rubyzip

Available rake targets:

* spec (default) - run RSpec Tests against the test app (start the dev app server first)
* package - Compile Grace jar and assemble download package