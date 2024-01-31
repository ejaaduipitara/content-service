package com.script.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

public class ReadDikshaData {
	
	static String baseUrl = "https://diksha.gov.in/api/content/v1/read/";
	static String postfix = "?fields=identifier,appIcon,mimeType,artifactUrl,streamingUrl";
	static ObjectMapper objectMapper = new ObjectMapper();
	
	public static List<Object> readData(List<Map<String, Object>> contentList) throws JsonProcessingException {
		List<Object> contentObjectList = new ArrayList<Object>();
	
		if(!contentList.isEmpty()) {
			for (Map<String, Object> content : contentList) {
				if(!content.isEmpty() && StringUtils.isNoneBlank((String)content.get("identifier"))) {
					String apiUrl = baseUrl + (String)content.get("identifier") + postfix;

			        try {
			            Map<String, Object> response = makeApiCall(apiUrl);
			            //System.out.println("API Response: " + response);
			            if(!response.isEmpty()) {
			            	Map<String, Object> contentObject = new HashMap<>();
			            	contentObject.putAll(content);
			            	contentObject.putAll(response);
			            	contentObjectList.add(contentObject);
			            }
			            
			        } catch (IOException e) {
			            e.printStackTrace();
			        }
				}
			}
			//String jsonString = objectMapper.writeValueAsString(contentObjectList);
			//System.out.println("contentMap #### " + jsonString);
		}
		return contentObjectList;
	}
	
	private static Map<String, Object> makeApiCall(String apiUrl)  throws IOException{
		HttpResponse<String> response = Unirest.get(apiUrl).asString();
		if(response.getStatus() ==200) {
			Map<String, Object> contentMap = (Map<String, Object>)((Map<String, Object>)(objectMapper.readValue(response.getBody(), Map.class)).get("result")).get("content");
			Map<String, Object> content = new HashMap<String, Object>();
			List<Map<String, Object>> mediaList = new ArrayList<>();
			
			content.put("thumbnail", contentMap.getOrDefault("appIcon", ""));
			content.put("mimetype", contentMap.getOrDefault("mimeType", ""));
			content.put("url", contentMap.getOrDefault("artifactUrl", ""));
			content.put("status", "Live");
			content.put("createdon", "NOW()");
			
			
			
			if(StringUtils.isNoneBlank((String)contentMap.getOrDefault("streamingUrl", ""))) {
				String mimeType = getStreamingUrlMimeType((String)contentMap.get("streamingUrl"));
				Map<String, Object> media = new HashMap<String, Object>();
				media.put("mimetype", StringUtils.isNotBlank(mimeType) ? mimeType : "" );
				media.put("url", contentMap.getOrDefault("streamingUrl", ""));
				mediaList.add(media);
			}
			content.put("media", mediaList);
			
			
			
			
			return content;
		}
		return null;
	}
	
	private static String getStreamingUrlMimeType(String url) {
		HttpResponse<String> response = Unirest.head(url).asString();
		if(response.getStatus()==200) {
			//System.out.println("####" + response.getHeaders().get("Content-Type").get(0));
			return response.getHeaders().get("Content-Type").get(0);
		}
		return null;
	}

}
