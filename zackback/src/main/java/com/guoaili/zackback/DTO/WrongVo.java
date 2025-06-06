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
public class WrongVo extends DpjVo {
    // private LocalDate inputDate;
    private String dpjno;
    private String back;
    private String point;
    private String easy;
    private String origin;
    private String inspect;
    private String correct;


    public WrongVo(String dpjno, String back, String point, String easy, String origin, String inspect, String correct, String subject, List<MultipartFile> files) {
        super();
        this.dpjno = dpjno;
        this.back = back;
        this.point = point;
        this.easy = easy;
        this.origin = origin;
        this.inspect = inspect;
        this.correct = correct;
        this.setSubject(subject);
        this.setFiles(files);
    }
    // private String subject;
    // private List<MultipartFile> files;    
}
