package com.script.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;


public class CsvWriter {
	
	static ObjectMapper objectMapper = new ObjectMapper();

	public static void writeData(List<Object> dikshaContentObjectList, List<Map<String, Object>> youtubeContentObjectList, String filePath) {
        

		List<String> headers = Arrays.asList("identifier", "name", "thumbnail", "description", "mimetype", "url", "media", "agegroup", "domain", "curriculargoal", "competencies", "language", "category", "sourceorg", "audience", "keywords", "status", "learningoutcomes", "createdon", "lastupdatedon");
        
        
        try (CSVWriter csvWriter = new CSVWriter(new FileWriter(filePath))) {
            // Write the header
            csvWriter.writeNext(headers.toArray(new String[0]));

            // Write data rows
            
            for (Object dikshaContentObject : dikshaContentObjectList) {
				Map<String, Object> contentObject = (Map<String, Object>)dikshaContentObject;
				List<String> contentMetadataList = new ArrayList<String>();
				for (String header : headers) 
					contentMetadataList.add(
							(contentObject.get(header) instanceof List || contentObject.get(header) instanceof Map) ? 
									objectMapper.writeValueAsString(contentObject.get(header)) :
										(String)contentObject.get(header));
					
				csvWriter.writeNext(contentMetadataList.toArray(new String[0]));
			}
            for (Map<String, Object> youtubeContentObject : youtubeContentObjectList) {
				List<String> contentMetadataList = new ArrayList<String>();
				for (String header : headers) 
					contentMetadataList.add(
							(youtubeContentObject.get(header) instanceof List || youtubeContentObject.get(header) instanceof Map) ?
									objectMapper.writeValueAsString(youtubeContentObject.get(header)) :
										(String)youtubeContentObject.get(header));
				
				csvWriter.writeNext(contentMetadataList.toArray(new String[0]));
			}

            System.out.println("CSV file written successfully!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
