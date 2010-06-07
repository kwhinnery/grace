(function() {
  var GLOBAL = this;
  
  //Define script loading functions
  function loadScript(file) {
    try {
      servlet.load(file)
    } catch(e) {
      com.grace.Utilities.severe("Failed to load script: "+file);
      com.grace.Utilities.severe(e);
    }
  }

  function loadAll(dir) {
    var files = com.grace.Utilities.javaScriptFilesInDirectory(dir);
    if (files) {
      for (var i = 0; i < files.length; i++) {
        loadScript(dir+"/"+files[i]);
      }
    }
  }
  
  function loadDefaults() {
    loadAll("grace/lib");
    loadAll("grace/helpers");
    loadAll("grace/models");
    loadAll("grace/controllers");
  }

  // PUBLIC API FOR CORE FRAMEWORK
  GLOBAL.grace = {
    //Script loading utilities
    loadScript: function(file) {
      grace.info("calling grace.loadScript...");
      loadScript(file);
    },
    loadAll: function(dir) {
      grace.info("calling grace.loadAll...");
      loadAll(dir);
    },
    
    //java.util.Logger
    info: function(message) {
      com.grace.Utilities.info(message);
    },
    warning: function(message) {
      com.grace.Utilities.warning(message);
    },
    severe: function(message) {
      com.grace.Utilities.severe(message);
    },
    
    //Read file as JavaScript String object
    read: function(file) {
      return String(com.grace.Utilities.readFileAsString(file));
    }
  };

  //Load primary dependencies
  grace.loadAll("grace/framework/lib");

  // Underscore to grace namespace to avoid collisions
  // NOTE: UNDERSCORE IS NOW A PART OF PUBLIC API
  _.extend(grace,_.noConflict());
  
  //Load Grace Framework
  grace.loadAll("grace/framework/modules");
  
  //load main application
  grace.loadScript("grace/app.js");
  
  //Load defaults, if present
  loadDefaults();
  
  //Route an process the request
  grace.doRoute();
})();

//return servlet at the end of execution - this is a globally available instance of com.grace.JavaScriptServlet
//used to build the response in the servlet
servlet;