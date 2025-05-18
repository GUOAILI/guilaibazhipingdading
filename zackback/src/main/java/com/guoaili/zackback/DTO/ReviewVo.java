package com.guoaili.zackback.DTO;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewVo extends DpjVo {
    private String category;
    private String title;
    private String detail;
    private String overview;
    public ReviewVo(String category, String title, String detail, String overview, String subject, List<MultipartFile> files) {
        super();
        this.category = category;
        this.title = title;
        this.detail = detail;
        this.overview = overview;
        this.setSubject(subject);
        this.setFiles(files);
    }

}
