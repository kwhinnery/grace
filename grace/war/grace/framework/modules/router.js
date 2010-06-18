(function() {
  var RESOURCES = [];
  
  //Convert a param map from a Servlet request to a JavaScript object
  function toObject(paramMap) {
    var obj = {};
    var keys = paramMap.keySet().toArray();
    grace.each(keys, function(element) {
      obj[element] = String(paramMap.get(element)[0]);
    });
    return obj;
  }
  
  // PUBLIC API FOR ROUTER
  // ---------------------
  grace.extend(grace,{
    //store the request content type
    fourOhFour: function(log) {
      grace.warning(log);
      grace.respond(grace.read("static/404.html"),"text/html",404);
    },
    fiveHundred: function(log) {
      grace.severe(log);
      grace.respond(grace.read("static/500.html"),"text/html",500);
    },
    //register a handler or handlers for a given resource or regular expression
    resource: function(pathOrRegExp,handler) {
      grace.info("calling grace.resource...");
      var resourceHandler = {
        matcher:null,
        namedArguments:null,
        replacer:null,
        methods:null
      };
      
      //assign HTTP verbs 
      if (grace.isFunction(handler)) { //GET is assumed when only a single handler is defined
        resourceHandler.methods = {
          GET: handler
        };
      }
      else {
        //other option for .methods is an object which defines GET, POST, etc...
        resourceHandler.methods = handler;
      }
      
      //If we have a RegExp, we don't have to do any replacement...
      if (grace.isRegExp(pathOrRegExp)) {
        resourceHandler.matcher = pathOrRegExp;
      }
      else {
        //If we're given a string, look for named parameters
        var paramSymbols = pathOrRegExp.match(/:([^\/]+)/g);
        var namedArguments = [];
        if (paramSymbols && paramSymbols.length > 0) {
          grace.each(paramSymbols,function(e) { 
            namedArguments.push(e.replace(":",""));
          });
          resourceHandler.namedArguments = namedArguments;
        }
        
        //Now, create a matcher that will find a request path
        var matcher = pathOrRegExp.replace(/\//g,"\\/");
        matcher = matcher+"$";
        
        //If we have any named arguments, we need to replace them in the route matcher
        if (namedArguments.length > 0) {
          grace.each(paramSymbols,function(e) { 
            matcher = matcher.replace(e,"[^\\/]*");
          });
          resourceHandler.replacer = new RegExp(matcher.replace(/\[\^\\\/\]\*/g, "([^\\/]+)"),"g");
        }
        
        //create a regex to match the path
        resourceHandler.matcher = new RegExp(matcher);
      }
      
      //store the resource handler
      RESOURCES.push(resourceHandler);
    },
    //process the request, using first available handler
    doRoute: function() {
      grace.info("calling grace.doRoute...");
      var uri = String(servlet.getRequest().getRequestURI());
      
      var match = null
      grace.each(RESOURCES, function(e) {
        //test pattern against requested path
        if (e.matcher.test(String(servlet.getRequest().getRequestURI()))) {
          match = e;
          grace.breakLoop();
        }
      });
      
      if (match == null) {
        grace.fourOhFour("grace.doRoute: 404 for route "+uri);
      }
      else {
        var ok = false;
        grace.info("grace.doRoute: found "+match.matcher);
        try {
          //Grab request params, and add in named params from the URI if need be
          var parameters = toObject(servlet.getRequest().getParameterMap());
          if (match.namedArguments && match.namedArguments.length > 0) {
            var args = match.replacer.exec(uri);
            if (args && args.length > 0) {
              for (var i = 0; i < match.namedArguments.length; i++) {
                parameters[match.namedArguments[i]] = args[i+1];
              }
            }
          }
          
          //call the handler
          var method = String(servlet.getRequest().getMethod());
          if (servlet.getRequest().getParameter("_method")) {
            method = String(servlet.getRequest().getParameter("_method"));
          }
          
          //Ensure we have a handler for this HTTP method
          if (match.methods[method] == undefined) {
            grace.fourOhFour("HTTP Method '"+method+"' is undefined for URI '"+uri+"'");
          }
          else {
            match.methods[method].call(this,parameters);
          }
          
          //request was processed successfully at this point
          ok = true;
        } 
        finally {
          //executing in a finally block to preserve the stack trace of the exception in the logs
          if (!ok) {
            //BWAHH!  500 error...
            grace.fiveHundred("Fatal error from request handler: "+match.matcher);
          }
        }
      }
    }
  });
})();