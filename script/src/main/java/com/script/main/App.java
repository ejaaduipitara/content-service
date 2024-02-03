package com.script.main;

import java.util.ArrayList;
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
        	
			//String inputFilePath = "/Documents/important/input-file.csv";
			//String outputFilePath = "/Documents/important/output-file.csv";
        	
        	String inputFilePath = args[0];
			String outputFilePath = args[1];
			if(StringUtils.isNoneBlank(inputFilePath)) {
				Map<String, Object> contentListObjects = CsvReader.readFile(inputFilePath);
				List<Map<String, Object>> dikshaContentList = (List<Map<String, Object>>)contentListObjects.get("diksha");
				List<Map<String, Object>> youtubeContentList = (List<Map<String, Object>>)contentListObjects.get("youtube");
				System.out.println("**********Diksha Content List********** ::" + dikshaContentList);
				System.out.println("**********Youtube Content List********** ::" + youtubeContentList);
				List<Object> dikshaContentObjectList = new ArrayList<Object>();
				if(!dikshaContentList.isEmpty()) {
					dikshaContentObjectList = ReadDikshaData.readData(dikshaContentList);
				}
				if(!dikshaContentObjectList.isEmpty() || !youtubeContentList.isEmpty()) {
					CsvWriter.writeData(dikshaContentObjectList, youtubeContentList, outputFilePath);
				}
					
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
}
