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
public class ExamVo extends DpjVo {
    private LocalDate examDate;
    private String title;
    private String easy;
    private int score;
    private String examType;
    private String evaluation;
    private String weakpoint;
    private String errsum;
    // private String subject;
    // private List<MultipartFile> files;
    public ExamVo(LocalDate examDate, String title, String easy, int score, String examType, String evaluation, String weakpoint, String errsum, String subject, List<MultipartFile> files) {
        super();
        this.examDate = examDate;
        this.title = title;
        this.easy = easy;
        this.score = score;
        this.examType = examType;
        this.evaluation = evaluation;
        this.weakpoint = weakpoint;
        this.errsum = errsum;
        this.setSubject(subject);
        this.setFiles(files);
    }
    
}
