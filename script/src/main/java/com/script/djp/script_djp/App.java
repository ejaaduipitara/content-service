package com.script.djp.script_djp;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.script.util.CsvReader;
import com.script.util.CsvWriter;
import com.script.util.ReadDikshaData;

public class App 
{
    public static void main( String[] args )
    {
        System.out.println( "Script Execution Started!!" );
        try {
        	
			//String inputFilePath = "/Users/NIIT/Documents/important/final-diksha-youtube-data.csv";
			//String outputFilePath = "/Users/NIIT/Documents/important/final-diksha-youtube-data-output-file-new.csv";
        	
        	String inputFilePath = args[0];
			String outputFilePath = args[1];
			if(StringUtils.isNoneBlank(inputFilePath)) {
				Map<String, Object> contentListObjects = CsvReader.readFile(inputFilePath);
				List<Map<String, Object>> dikshaContentList = (List<Map<String, Object>>)contentListObjects.get("diksha");
				List<Map<String, Object>> youtubeContentList = (List<Map<String, Object>>)contentListObjects.get("youtube");
				System.out.println("**********Diksha Content List********** ::" + dikshaContentList);
				System.out.println("**********Youtube Content List********** ::" + youtubeContentList);
				if(!dikshaContentList.isEmpty()) {
					List<Object> dikshaContentObjectList = ReadDikshaData.readData(dikshaContentList);
					if(!dikshaContentObjectList.isEmpty()) {
						CsvWriter.writeData(dikshaContentObjectList, youtubeContentList, outputFilePath);
					}
				}
					
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
}
