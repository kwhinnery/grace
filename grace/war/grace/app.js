/*
* This is a test Grace Application used for purposes of automated testing
*/

//render static index page
grace.resource("/", function() {
  grace.respond(grace.read("static/index.html"),"text/html",200);
});

// Testing raw respond - helper over the top of servlet object
grace.resource("/respond", function(params) {
  grace.respond("response","text/plain",202);
});

// Render hello world in plain text
grace.resource("/text", function(params) {
  grace.render("Hello World!");
});

// render different text for available HTTP methods.
grace.resource("/rest",{
  GET: function(params) {
    grace.render("get");
  },
  POST: function(params) {
    grace.render("post");
  },
  PUT: function(params) {
    grace.render("put");
  },
  DELETE: function(params) {
    grace.render("delete");
  },
  HEAD: function(params) {
    grace.respond("","text/plain",201);
  }
});

//Route based on a regular expression
grace.resource(/^\/reg.*p/, function(params) {
  grace.render("regexp ftw");
});

//Pull parameters from request URL
grace.resource("/url/params/:id", {
  GET: function(params) {
    grace.render("get:"+params.id);
  },
  DELETE: function(params) {
    grace.render("delete:"+params.id);
  }
});

grace.resource("/url/:id/params/:bar", {
  PUT: function(params) {
    grace.render("put:"+params.id+":"+params.bar);
  },
  POST: function(params) {
    grace.render("post:"+params.id+":"+params.bar);
  }
});

//Test templating with no layout
grace.resource("/template/:id", function(params) {
  grace.render({id:params.id}, {
    layout:"",
    template:"test/test"
  });
});
