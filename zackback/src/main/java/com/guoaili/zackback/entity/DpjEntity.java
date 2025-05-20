package com.guoaili.zackback.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guoaili.zackback.exception.BusinessException;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Converter;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public class DpjEntity implements Serializable{

    // the common part for all table
    private String username;
    private String school;
    private int grade;
    private boolean is_deleted;
    private String subject;

    // store the file url which indicates the location the file is saved at. 
    @Column(columnDefinition = "LONGTEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> mjddyz;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate beginday;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate modday;
    
}


@Converter
class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) throws BusinessException {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            // throw new RuntimeException("Error converting list to JSON", e);
            throw new BusinessException("list转数据库列出错: ");
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) throws BusinessException {
        try {
            if (dbData == null || dbData.isEmpty()) {
                return null;
            }
            return objectMapper.readValue(dbData, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            // throw new RuntimeException("Error converting JSON to list", e);
            throw new BusinessException("数据库列转list出错: ");
        }
    }
}