require 'rubygems'
require 'yaml'
require 'mechanize'

# Set up mechanize agent and get endpoint to run test suite against
CONFIG = YAML::load_file(File.expand_path(File.dirname(__FILE__))+'/../config.yml')
app = CONFIG[:spec_endpoint]
agent = Mechanize.new

describe "Test Suite: Routing and Rendering" do
  it "responds with proper content, content type, and status code" do
    page = agent.get(app+"/respond")
    page.response["Content-Type"].should == "text/plain; charset=utf-8"
    page.body.should == "response"
    page.code.should == "202"
  end
  
  it "renders Hello World" do
    page = agent.get(app+"/text")
    page.body.should == "Hello World!"
  end
  
  it "routes to proper handlers based on HTTP method" do
    src = app+'/rest'
    
    page = agent.get(src)
    page.body.should == "get"
    
    page = agent.post(src)
    page.body.should == "post"
    
    page = agent.put(src,"")
    page.body.should == "put"
    
    page = agent.delete(src)
    page.body.should == "delete"
    
    page = agent.head(src)
    page.code.should == "201"
  end
  
  it "uses RegExp based routing" do
    page = agent.get("#{app}/regexp")
    page.body.should == "regexp ftw"
    
    rescued = false
    begin
      page = agent.get("#{app}/foo/regexp") #should throw exception on 404
    rescue
      rescued = true
    end
    
    rescued.should == true
  end
  
  it "pulls parameter values from the request URL" do
    src1 = app+"/url/params/1"
    src2 = app+"/url/scooby/params/doo"
    
    page = agent.get(src1)
    page.body.should == "get:1"
    
    page = agent.delete(src1)
    page.body.should == "delete:1"
    
    page = agent.put(src2,"")
    page.body.should == "put:scooby:doo"
    
    page = agent.post(src2)
    page.body.should == "post:scooby:doo"
  end
  
  it "renders a template with no layout" do
    page = agent.get("#{app}/template/13")
    page.search("#header").first.content.should == "26"
    page.search("p").first.content.should == "13"
  end
end