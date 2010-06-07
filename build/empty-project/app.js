/*

Welcome to Grace Framework!  JavaScript on the server, how badass is that?

This is your application's bootstrap file.  All JavaScript files from the following directories
are auto-loaded, in the following order, if they exist:

grace/lib
grace/helpers
grace/models
grace/controllers

View templates will be resolved relative to

grace/views

Use this file to configure global namespaces (GLOBAL.your_cool_module_or_variable), bootstrap your app,
or even implement your whole app if you like.

For more information, check README.md

*/

grace.resource("/",function(params) {
  grace.respond(grace.read("static/index.html"),"text/html",200);
});