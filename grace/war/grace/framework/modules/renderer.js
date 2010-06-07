(function() {
  
  //return a rendered template with the given layout and template 
  function renderTemplate(layout,template,data) {
    //Get our primary template
    var tpl = grace.read("grace/views/"+template+".html");
    var finalTemplate = tpl;
    var replacements = {
      main:tpl
    };
    
    //look for content for our yield
    var tokens = tpl.match(/::[^\s].*[^\s]::/g);
    
    //If we have any content to replace in a layout, let's capture them
    for (var i = 0; i < tokens.length; i++) {
      var tkn = tokens[i];
      var idx = tpl.indexOf(tkn);
      if (i == 0) {
        replacements.main = tpl.substring(0,idx);
      }
      //Grab the appropriate substring to replace in a layout
      if (i+1 == tokens.length) {
        replacements[tokens[i].replace(/:/g,"")] = tpl.substring(idx+tkn.length);
      }
      else {
        replacements[tokens[i].replace(/:/g,"")] = tpl.substring(idx+tkn.length,tpl.indexOf(tokens[i+1]));
      }
    }
    
    //now, let's grab our layout (if we have one)
    if (layout != "") {
      var layoutTemplate = grace.read("grace/views/layouts/"+layout+".html");
      //If we have any content to replace in a layout, let's replace
      grace.each(replacements,function(value,key) {
        layoutTemplate = layoutTemplate.replace("::"+key+"::",value);
      });
      finalTemplate = layoutTemplate;
    }
    
    //finally, render our template
    grace.info("grace.render: rendering template: "+template);
    grace.respond(grace.template(finalTemplate,data),"text/html",200);
  }
  
  // PUBLIC API FOR RENDERER
  // ---------------------
  grace.extend(grace,{
    // Convert a Java type to pure JavaScript using Jackson
    toJS: function(javaThing) {
      grace.info("calling grace.toJS...");
      return grace.JSON.parse(com.grace.Utilities.javaToJSON(javaThing));
    },
    //respond by writing directly to HttpServletResponse
    respond: function(text,contentType,status) {
      grace.info("calling grace.respond...");
      servlet.getResponse().setCharacterEncoding("utf-8");
      servlet.getResponse().setStatus(status);
      servlet.getResponse().setContentType(contentType);
      servlet.getResponse().getWriter().print(text);
    },
    //render output to the global request object based on request type, data, available templates
    render: function(data,options) {
      grace.info("calling grace.render...");
      //If string, render text
      if (grace.isString(data)) {
        grace.info("grace.render: rendering plain text...");
        grace.respond(data,"text/plain",200);
      }
      //Otherwise, we render HTML or JSON depending on _fmt parameter
      else {
        //Spit out JSON if requested using magic _fmt parameter
        if (String(servlet.getRequest().getParameter("_fmt")) == "json") {
          grace.info("grace.render: rendering JSON...");
          //com.grace.Utilities.jsonResponse(servlet.getResponse(),null);
          grace.respond(grace.JSON.stringify(data),"application/json",200);
        }
        //Otherwise, time to template some HTML...
        else {
          grace.info("grace.render: rendering HTML...");
          //assume a string is a template name
          if (grace.isString(options)) {
            renderTemplate("application", options, data);
          }
          else {
            renderTemplate(options.layout, options.template, data);
          }
        }
      }
    }
  });
})();