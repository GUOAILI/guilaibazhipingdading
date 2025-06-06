package com.guoaili.zackback.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.guoaili.zackback.DTO.CommonVo;
import com.guoaili.zackback.DTO.ExamVo;
import com.guoaili.zackback.DTO.ExtensionVo;
import com.guoaili.zackback.DTO.FileInfo;
import com.guoaili.zackback.DTO.NotebookVo;
import com.guoaili.zackback.DTO.ResponseMessage;
import com.guoaili.zackback.DTO.ReviewVo;
import com.guoaili.zackback.DTO.SummaryVo;
import com.guoaili.zackback.DTO.WritingVo;
import com.guoaili.zackback.DTO.WrongVo;
import com.guoaili.zackback.service.FileStorageService;
import com.guoaili.zackback.util.FileParamUtil;


@RestController
@CrossOrigin
@RequestMapping("/localupload")
public class FilesController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile... file){
        String message="";
        try{
            for(MultipartFile zpd : file){
                storageService.save(zpd);
                // message="文件上传成功: " + zpd.getOriginalFilename();
            }
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("文件上传成功"));
        }catch(Exception e){
            message="无法上传文件" + ". 错误原因: "+ e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage((message)));
        }
    }

    // 2024/6/20
    @PostMapping("/baiduwenxin/writing")  
    public ResponseEntity<String> handleFileUpload(
        @RequestBody Map<String, Object> params) {
    
        int imp = Integer.parseInt(params.get("imp").toString());
        String title = params.get("title").toString();
        String topic = params.get("topic").toString();
        String sample = params.get("sample").toString();
        String comments = params.get("comments").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");
  
            // @RequestParam(value = "files",required = false) List<MultipartFile> files, 
            // @RequestParam("imp") int imp,  
            // @RequestParam("title") String title,  
            // @RequestParam("topic") String topic,  
            // @RequestParam("sample") String sample,  
            // @RequestParam("comments") String comments,
            // @RequestParam("subject") String subject) {  
  
        WritingVo wv=new WritingVo(imp, title,topic, sample, comments,subject ,multipartFiles);
        storageService.uploadWriting(wv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }

    // 2025/4/27 新增 common 文件上传与保存
    @PostMapping("/baiduwenxin/common")
    public ResponseEntity<String> handleCommonFileUpload(
        @RequestBody Map<String, Object> params){
    
        int imp = Integer.parseInt(params.get("imp").toString());
        String title = params.get("title").toString();
        String sample = params.get("sample").toString();
        String subject = params.get("subject").toString();
        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");

    // @PostMapping("/baiduwenxin/common")
    // public ResponseEntity<String> handleCommonFileUpload(
    //         @RequestParam(value = "files", required = false) List<MultipartFile> files,
    //         @RequestParam("title") String title,
    //         @RequestParam("imp") int imp,  
    //         @RequestParam("sample") String sample,
    //         @RequestParam("subject") String subject
    // ) {
        // 你需要创建 CommonVo 类，类似 WritingVo
        // CommonVo cv = new CommonVo( title,imp, sample, subject, files);
        CommonVo cv = new CommonVo( title,imp, sample, subject, multipartFiles);
        storageService.uploadCommon(cv);

        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);
    }


    @PostMapping("/baiduwenxin/notebook")  
    public ResponseEntity<String> handleNbFileUpload( 
        @RequestBody Map<String, Object> params) {
    
        int num = Integer.parseInt(params.get("num").toString());
        String keyword = params.get("keyword").toString();
        String easy = params.get("easy").toString();
        String point = params.get("point").toString();
        String teacher = params.get("teacher").toString();
        String remarks = params.get("remarks").toString();
        String post = params.get("post").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");
 
        NotebookVo nv=new NotebookVo(num,keyword, easy, point, teacher, remarks, post,subject, multipartFiles);
        storageService.uploadNotebook(nv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  

    @PostMapping("/baiduwenxin/exam")  
    public ResponseEntity<String> handleExamFileUpload( 
        @RequestBody Map<String, Object> params) {
    
        LocalDate examDate = LocalDate.parse(params.get("examDate").toString());
        String title = params.get("title").toString();
        String easy = params.get("easy").toString();
        int score = Integer.parseInt(params.get("score").toString());
        String examType = params.get("examType").toString();
        String evaluation = params.get("evaluation").toString();
        String weakpoint = params.get("weakpoint").toString();
        String errsum = params.get("errsum").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");
 
            // @RequestParam(value = "files",required = false) List<MultipartFile> files,  
        ExamVo nv=new ExamVo(examDate,title, easy,score, examType, evaluation, weakpoint, errsum,subject, multipartFiles);
        storageService.uploadExam(nv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  

    @PostMapping("/baiduwenxin/review")  
    public ResponseEntity<String> handleReviewFileUpload(  
        @RequestBody Map<String, Object> params) {
    
        String title = params.get("title").toString();
        String category = params.get("category").toString();
        String detail = params.get("detail").toString();
        String overview = params.get("overview").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");

            // @RequestParam(value = "files",required = false) List<MultipartFile> files,  
            // @RequestParam("category") String category,  
            // @RequestParam("title") String title,  
            // @RequestParam("detail") String detail,  
            // @RequestParam("overview") String overview,
            // @RequestParam("subject") String subject) {  
        ReviewVo nv=new ReviewVo(category,title, detail, overview,subject, multipartFiles);
        storageService.uploadReview(nv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  
    // 2024/6/29
    @PostMapping("/baiduwenxin/wrong")  
    public ResponseEntity<String> handleWrongFileUpload(  
        @RequestBody Map<String, Object> params) {
    
        String dpjno = params.get("dpjno").toString();
        String back = params.get("back").toString();
        String point = params.get("point").toString();
        String easy = params.get("easy").toString();
        String origin = params.get("origin").toString();
        String inspect = params.get("inspect").toString();
        String correct = params.get("correct").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");

        WrongVo wv=new WrongVo(dpjno,back,point,easy,origin,inspect,correct,subject,multipartFiles);
        storageService.uploadWrong(wv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  
    // 2024/6/29
    @PostMapping("/baiduwenxin/summary")  
    public ResponseEntity<String> handleSummaryFileUpload(  
        @RequestBody Map<String, Object> params) {
    
        String title = params.get("title").toString();
        String keyPoints = params.get("keyPoints").toString();
        String easy = params.get("easy").toString();
        String knowledge = params.get("knowledge").toString();
        String example = params.get("example").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");

        SummaryVo sv=new SummaryVo(title,easy,knowledge,keyPoints,example,subject,multipartFiles);
        storageService.uploadSummary(sv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  
    @PostMapping("/baiduwenxin/extension")  
    public ResponseEntity<String> handleExtensionFileUpload( 
        @RequestBody Map<String, Object> params) {
    
        LocalDate extDate = LocalDate.parse(params.get("extDate").toString());
        String abs = params.get("abs").toString();
        String easy = params.get("easy").toString();
        String teacher = params.get("teacher").toString();
        String content = params.get("content").toString();
        String subject = params.get("subject").toString();

        List<MultipartFile> multipartFiles = FileParamUtil.parseFilesFromParam(params, "files");
 
        ExtensionVo wv=new ExtensionVo(extDate,teacher,abs,easy,content,subject, multipartFiles);
        storageService.uploadExtension(wv);

        // 返回响应  
        return new ResponseEntity<>("Files uploaded successfully!", HttpStatus.OK);  
    }  


    @PostMapping("/upload/writing")
    public ResponseEntity<String> uploadWriting(@RequestBody WritingVo wv) {
        storageService.uploadWriting(wv);
        // todo here 2024/6/19
        return ResponseEntity.ok().body("写入后台成功");
    }
    
    @GetMapping("/files")
    public ResponseEntity<List<FileInfo>> getListFiles(){
        List<FileInfo> fileInfos =storageService.loadAll()
                .map(path-> {
                    String filename=path.getFileName().toString();
                    String url=MvcUriComponentsBuilder
                        .fromMethodName(
                            FilesController.class, 
                            "getFile", 
                            path.getFileName().toString())
                        .build().toString();
                    return new FileInfo(filename, url);
                }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename){
        Resource file=storageService.load(filename);
        String encodedFilename = URLEncoder.encode(file.getFilename(), StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok().header(
            HttpHeaders.CONTENT_DISPOSITION,
            // "attachment; filename=\"" + file.getFilename() + "\""
            "attachment; filename=\"" + encodedFilename + "\""
            ).body(file);
    }

    // 2024/6/20 add for zhuzhuddyz,for react front side <Image> tag useing only
    // 2024/7/1 the img tag of front end will send this httpRequest implicitly
    // so it will be intecepted by spring security and cannot display the picture.
    // u must skip the authentication to let the request come in
    @GetMapping("/files/{zzday}/{filename:.+}")
    @ResponseBody
    // public ResponseEntity<Resource> getzzFile(@PathVariable Map<String,String> zzDdyz){
    public ResponseEntity<Resource> getzzFile(@PathVariable String zzday,@PathVariable String filename){
        Resource file=storageService.loadzz(zzday,filename);
        String encodedFilename = URLEncoder.encode(file.getFilename(), StandardCharsets.UTF_8).replace("+", "%20");
        return ResponseEntity.ok().header(
            HttpHeaders.CONTENT_DISPOSITION,
            // "attachment; filename=\"" + file.getFilename() + "\""
            "attachment; filename=\"" + encodedFilename + "\""
            ).body(file);
    }

    @GetMapping("/delete/{filename:.+}")
    public ResponseEntity<String> deleteFile(@PathVariable String filename){
        storageService.deleteByName(filename);
        return ResponseEntity.status(HttpStatus.OK).body("删除成功");
    }

    // 2024/6/20 add for zhuzhuddyz,for react front side <Image> tag useing only
    @GetMapping("/delete/{zzday}/{filename:.+}")
    public ResponseEntity<String> deletezzFile(@PathVariable String zzday,@PathVariable String filename){
        storageService.deleteByNamezz(zzday,filename);
        return ResponseEntity.status(HttpStatus.OK).body("删除成功");
    }
}