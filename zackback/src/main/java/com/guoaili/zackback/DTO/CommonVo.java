package com.guoaili.zackback.DTO;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonVo extends DpjVo {

    private String title;
    private String sample;
    private String subject;

    // private MultipartFile[] file;
    private List<MultipartFile> files;
}
