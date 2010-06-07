package com.grace;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.logging.Logger;

import org.codehaus.jackson.map.ObjectMapper;

public class Utilities {
	private static final Logger log = Logger.getLogger(GraceServlet.class.getName());
	
	private static FilenameFilter filter = new FilenameFilter() { 
		public boolean accept(File dir, String name) { 
			return name.endsWith(".js"); 
		}
	};
	
	private static ObjectMapper mapper = new ObjectMapper();
	
	public static String javaToJSON(Object value) throws IOException {
		return mapper.writeValueAsString(value);
	}
	
	public static String readFileAsString(String filePath) throws java.io.IOException{
	    byte[] buffer = new byte[(int) new File(filePath).length()];
	    BufferedInputStream f = new BufferedInputStream(new FileInputStream(filePath));
	    f.read(buffer);
	    return new String(buffer);
	}
	
	public static String[] javaScriptFilesInDirectory(String directory) {
		File dir = new File(directory);
		String[] children = null;
		children = dir.list(filter);
		return children;
	}
	
	public static void info(String msg) {
		log.info(msg);
	}
	
	public static void warning(String msg) {
		log.warning(msg);
	}
	
	public static void severe(String msg) {
		log.severe(msg);
	}
}
