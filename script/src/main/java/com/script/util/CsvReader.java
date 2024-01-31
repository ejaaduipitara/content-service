package com.script.util;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class CsvReader {

	public static Map<String, Object> readFile(String filePath) throws CsvValidationException {
        List<Map<String, Object>> dikshaContentList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> youtubeContentList = new ArrayList<Map<String, Object>>();
        try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(filePath)).withSkipLines(0).build()) {
            String[] header = csvReader.readNext();
            if (header != null) {
                String[] line;
                while ((line = csvReader.readNext()) != null) {
                    // Process each line of data
                	Map<String, Object> content = new HashMap<>();
                    for (int i = 0; i < header.length; i++) {
                        //System.out.println(header[i] + ": " + line[i]);
                    	String data = StringUtils.trim(StringUtils.endsWith(StringUtils.trim(line[i]), ",") ? StringUtils.removeEnd(StringUtils.trim(line[i]), ",") : StringUtils.trim(line[i]));
						/*
						 * if(StringUtils.endsWith(data, ",")) StringUtils.removeEnd(data, ","); else
						 * if(StringUtils.endsWith(data, " ,")) StringUtils.removeEnd(data, " ,"); else
						 * if(StringUtils.endsWith(data, ", ")) StringUtils.removeEnd(data, ", ");
						 */
                    	
                    	
                    	
                    	
                    	
                    	if(StringUtils.contains(header[i], "Content Link")) {
                    		if(StringUtils.isNoneBlank(data) && StringUtils.contains(data, "do_")) 
                    			content.put("identifier", data);
                    		else if(StringUtils.isNoneBlank(data) && StringUtils.contains(data, "youtu")){
                    			content.put("mimetype", "video/x-youtube");
                    			content.put("url", data);
                    			content.put("status", "Live");
                    			content.put("createdon", "NOW()");
                    			continue;
                    		}
                    		else break;
                    	}
                    	if(StringUtils.contains(header[i], "identifier")) 
                    		if(StringUtils.isNoneBlank(data) && !StringUtils.contains(data, "do_")) 
                    			content.put("identifier", data);
                    	
                    	if(StringUtils.contains(header[i], "Name of the Content")  && StringUtils.isNoneBlank(data))
                    		content.put("name", data);
                    	
                    	if(StringUtils.contains(header[i], "Age Group")  && StringUtils.isNoneBlank(data)) 
                    		content.put("agegroup", data);
                    	
                    	if(StringUtils.contains(header[i], "Domains")  && StringUtils.isNoneBlank(data)) 
                    		content.put("domain", data);
                    	
                    	if(StringUtils.contains(header[i], "Curricular Goals")  && StringUtils.isNoneBlank(data)) 
                    		content.put("curriculargoal", data);
                    	
                    	if(StringUtils.contains(header[i], "Competency") && StringUtils.isNoneBlank(data)) 
                    		content.put("competencies", "{" + data + "}");
                    	
                    	if(StringUtils.contains(header[i], "Language")  && StringUtils.isNoneBlank(data)) 
                    		content.put("language", data);
                    	
                    	if(StringUtils.contains(header[i], "Content Category")  && StringUtils.isNoneBlank(data)) 
                    		content.put("category", data);
                    	
                    	if(StringUtils.contains(header[i], "Source Org")  && StringUtils.isNoneBlank(data)) 
                    		content.put("sourceorg", data);
                    	
                    	if(StringUtils.contains(header[i], "Persona") && StringUtils.isNoneBlank(data)) 
                    		content.put("audience", "{" + data + "}");
                    	
                    	if(StringUtils.contains(header[i], "Key Words") && StringUtils.isNoneBlank(data)) 
                    		content.put("keywords", "{" + data + "}");
                    	
                    	if(StringUtils.contains(header[i], "Learning Outcomes")  && StringUtils.isNoneBlank(data)) 
                    		content.put("learningoutcomes", data);
                    }
                    if(StringUtils.isNoneBlank((String)content.get("identifier"))) {
                    	if(StringUtils.startsWith((String)content.get("identifier"), "do_")) 
                    		dikshaContentList.add(content);
                    	else 
                    		youtubeContentList.add(content);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        Map<String, Object> contentListObjects = new HashMap<>();
        contentListObjects.put("diksha", dikshaContentList);
        contentListObjects.put("youtube", youtubeContentList);
        return contentListObjects;
    }
}
