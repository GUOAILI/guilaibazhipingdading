package com.guoaili.zackback.service.serviceImpl;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.guoaili.zackback.DTO.CommonUpdVo;
import com.guoaili.zackback.DTO.DpjVo;
import com.guoaili.zackback.DTO.ExamUpdVo;
import com.guoaili.zackback.DTO.ExtensionUpdVo;
import com.guoaili.zackback.DTO.NotebookUpdVo;
import com.guoaili.zackback.DTO.ReviewUpdVo;
import com.guoaili.zackback.DTO.SummaryUpdVo;
import com.guoaili.zackback.DTO.WritingUpdVo;
import com.guoaili.zackback.DTO.WrongUpdVo;
import com.guoaili.zackback.entity.CommonEntity;
import com.guoaili.zackback.entity.DpjEntity;
import com.guoaili.zackback.entity.ExamEntity;
import com.guoaili.zackback.entity.ExtensionEntity;
import com.guoaili.zackback.entity.NotebookEntity;
import com.guoaili.zackback.entity.ReviewEntity;
import com.guoaili.zackback.entity.SummaryEntity;
import com.guoaili.zackback.entity.WritingEntity;
import com.guoaili.zackback.entity.WrongEntity;
import com.guoaili.zackback.enumT.Difficulty;
import com.guoaili.zackback.enumT.Important;
import com.guoaili.zackback.exception.BusinessException;
import com.guoaili.zackback.repository.CommonRepository;
import com.guoaili.zackback.repository.ExamRepository;
import com.guoaili.zackback.repository.ExtensionRepository;
import com.guoaili.zackback.repository.NotebookRepository;
import com.guoaili.zackback.repository.ReviewRepository;
import com.guoaili.zackback.repository.SummaryRepository;
import com.guoaili.zackback.repository.WritingRepository;
import com.guoaili.zackback.repository.WrongRepository;
import com.guoaili.zackback.service.FileStorageService;
import com.guoaili.zackback.service.TableService;
import com.guoaili.zackback.service.UserService;

import io.jsonwebtoken.lang.Arrays;


@Service
public class TableServiceImpl implements TableService{
    @Autowired
    private WritingRepository writingRepository;

    @Autowired
    private NotebookRepository notebookRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private WrongRepository wrongRepository;

    @Autowired
    private ExtensionRepository extensionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CommonRepository commonRepository;

    @Autowired
    private SummaryRepository summaryRepository;


    @Override
    public List<WritingEntity> getAllWriting(String subject) {
        List<WritingEntity> bySubject = writingRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }

    @Override
    public List<NotebookEntity> getAllNotebook(String subject) {
        List<NotebookEntity> bySubject = notebookRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }

    @Override
    public void deleteOneWriting(long id) {
        try{
            writingRepository.deleteByIdLogical(id);
        }catch(Exception ex){
            throw new BusinessException("删除写作记录时发生异常");
        }
    }

    @Override
    public void deleteOneNotebook(long id) {
        try{
            notebookRepository.logicalDeleteById(id);
            // System.out.println("success");
        }catch(Exception e){
            // System.out.println("error");
            throw new BusinessException("删除课本记录时发生异常");
        }
    }

    @Override
    public List<ExamEntity> getAllExam(String subject) {
        List<ExamEntity> bySubject = examRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }

    @Override
    public void deleteOneExam(long id) {
        try{
            examRepository.logicalDeleteById(id);
            // System.out.println("success");
        }catch(Exception e){
            throw new BusinessException("删除试卷汇总记录时发生异常");
        }
    }

    @Override
    public void deleteOneReview(long id) {
        try{
            reviewRepository.logicalDeleteById(id);
            // System.out.println("success");
        }catch(Exception e){
            throw new BusinessException("删除复习记录时发生异常");
        }
    }

    @Override
    public List<ReviewEntity> getAllReview(String subject) {
        List<ReviewEntity> bySubject = reviewRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }

    @Override
    public void deleteOneWrong(long id) {
        try{
            wrongRepository.logicalDeleteById(id);
        }catch(Exception e){
            throw new BusinessException("删除错题积累记录时发生异常");
        }
    }
    // 2025/6/6 add toczpd
    @Override
    public void deleteOneSummary(long id) {
        try{
            summaryRepository.logicalDeleteById(id);
        }catch(Exception e){
            throw new BusinessException("删除归纳总结记录时发生异常");
        }
    }

    @Override
    public List<WrongEntity> getAllWrong(String subject) {
        List<WrongEntity> bySubject = wrongRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }
    // 2025/6/6 add toczpd
    @Override
    public List<SummaryEntity> getAllSummary(String subject) {
        List<SummaryEntity> bySubject = summaryRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }
    
    @Override
    public void deleteOneExtension(long id) {
        try{
            extensionRepository.logicalDeleteById(id);
            // System.out.println("success");
        }catch(Exception e){
            throw new BusinessException("删除课外扩展记录时发生异常");
        }
    }

    @Override
    public List<ExtensionEntity> getAllExtension(String subject) {
        List<ExtensionEntity> bySubject = extensionRepository.findBySubject(userService.getUser().getUsername(),subject);
        return bySubject;
    }

    // 2024/7/1 two methods of parse the url path and get the result
    private  String getFilenameFromUrl(String in){
        return in.substring(in.lastIndexOf("/")+1);
    }

    private String getLastPathName(String in){
        String zpd1=in.substring(0,in.lastIndexOf("/"));
        String zpd2=zpd1.substring(zpd1.lastIndexOf("/")+1);
        return zpd2;
    }

    private <T extends DpjVo,B extends DpjEntity> void saveAndDeleteImages(T t,B b){
        List<String> zpdbyz=fileStorageService.saveComingInUploadImageFile(t);
        // this is the coming in data that will be deleting
        List<String> cde=null;

        if (StringUtils.hasText(t.getDelImages()) ){
            List<String> mjddyz=Arrays.asList(t.getDelImages().split(","));
            // delete the physical files from disk
            for(String zpd:mjddyz){
                fileStorageService.deleteByNamezz(getLastPathName(zpd), getFilenameFromUrl(zpd));
            }
            List<String> abc =b.getMjddyz().stream().filter(item->!mjddyz.contains(item)).collect(Collectors.toList());
            // merge the abc list with the new coming new upload data list
            cde=Stream.of(abc,zpdbyz).
                            flatMap(Collection::stream).
                            collect(Collectors.toList());
        }else{
            cde=Stream.of(b.getMjddyz(),zpdbyz).
                            flatMap(Collection::stream).
                            collect(Collectors.toList());
        }
        b.setMjddyz(cde);
    }

    @Override
    public void updateOneWriting(WritingUpdVo wuv) {
        WritingEntity zpddbz =writingRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);
        // set the new coming data for update
        zpddbz.setComments(wuv.getComments());
        zpddbz.setModday(LocalDate.now());
        zpddbz.setSample(wuv.getSample());
        // 2025/4/30 add important item
        Important[] values = Important.values();
        Important impEnum = values[wuv.getImp() - 1];
        zpddbz.setImp(impEnum);

        zpddbz.setTitle(wuv.getTitle());
        zpddbz.setTopic(wuv.getTopic());
        writingRepository.save(zpddbz);
    }

    @Override
    public void updateOneExtension(ExtensionUpdVo wuv) {
        ExtensionEntity zpddbz =extensionRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);
        // wuv.setExtDate(extDate);
        // wuv.setAbs(abs);
        // wuv.setTeacher(teacher);
        // wuv.setEasy(easy);
        // wuv.setContent(content);

        zpddbz.setModday(LocalDate.now());
        zpddbz.setExtDate(wuv.getExtDate());
        zpddbz.setAbs(wuv.getAbs());
        zpddbz.setTeacher(wuv.getTeacher());
        zpddbz.setContent(wuv.getContent());
        zpddbz.setEasy(wuv.getEasy().equals("low") ? Difficulty.低 :
            wuv.getEasy().equals("medium") ? Difficulty.中 : Difficulty.高);
        extensionRepository.save(zpddbz);
    }

    @Override
    public void updateOneNotebook(NotebookUpdVo wuv) {
        NotebookEntity zpddbz =notebookRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);
        // wuv.setNum(num);
        // wuv.setKeyword(keyword);
        // wuv.setTeacher(teacher);
        // wuv.setEasy(easy);
        // wuv.setPoint(point);
        // wuv.setRemarks(remarks);
        // wuv.setPost(post);

        zpddbz.setModday(LocalDate.now());
        zpddbz.setNum(wuv.getNum());
        zpddbz.setKeyword(wuv.getKeyword());
        zpddbz.setPoint(wuv.getPoint());
        zpddbz.setTeacher(wuv.getTeacher());
        zpddbz.setRemarks(wuv.getRemarks());
        zpddbz.setPost(wuv.getPost());
        zpddbz.setEasy(wuv.getEasy().equals("low") ? Difficulty.低 :
            wuv.getEasy().equals("medium") ? Difficulty.中 : Difficulty.高);
        notebookRepository.save(zpddbz);
    }

    @Override
    public void updateOneExam(ExamUpdVo wuv) {
        ExamEntity zpddbz =examRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);
        // wuv.setExamDate(examDate);
        // wuv.setTitle(title);
        // wuv.setScore(score);
        // wuv.setExamType(examType);
        // wuv.setErrsum(errsum);
        // wuv.setEvaluation(evaluation);
        // wuv.setWeakpoint(weakpoint);
        // wuv.setEasy(easy);

        zpddbz.setModday(LocalDate.now());
        zpddbz.setExamDate(wuv.getExamDate());
        zpddbz.setTitle(wuv.getTitle());
        zpddbz.setScore(wuv.getScore());
        zpddbz.setExamType(wuv.getExamType());
        zpddbz.setErrsum(wuv.getErrsum());
        zpddbz.setEvaluation(wuv.getEvaluation());
        zpddbz.setWeakpoint(wuv.getWeakpoint());

        zpddbz.setEasy(wuv.getEasy().equals("low") ? Difficulty.低 :
            wuv.getEasy().equals("medium") ? Difficulty.中 : Difficulty.高);
        examRepository.save(zpddbz);
    }

    @Override
    public void updateOneReview(ReviewUpdVo wuv) {
        ReviewEntity zpddbz =reviewRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);
        zpddbz.setModday(LocalDate.now());
        // zpddbz.setReviewDate(wuv.getReviewDate());
        zpddbz.setCategory(wuv.getCategory());
        zpddbz.setTitle(wuv.getTitle());
        zpddbz.setDetail(wuv.getDetail());
        zpddbz.setOverview(wuv.getOverview());
        reviewRepository.save(zpddbz);
    }

    @Override
    public void updateOneWrong(WrongUpdVo wuv) {
        WrongEntity zpddbz =wrongRepository.findById(wuv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(wuv, zpddbz);

        zpddbz.setModday(LocalDate.now());
        zpddbz.setDpjno(wuv.getDpjno());
        zpddbz.setBack(wuv.getBack());
        zpddbz.setPoint(wuv.getPoint());
        zpddbz.setOrigin(wuv.getOrigin());
        zpddbz.setInspect(wuv.getInspect());
        zpddbz.setCorrect(wuv.getCorrect());
        zpddbz.setEasy(wuv.getEasy().equals("low") ? Difficulty.低 :
            wuv.getEasy().equals("medium") ? Difficulty.中 : Difficulty.高);
        wrongRepository.save(zpddbz);
    }

    // 2025/6/6 add toczpd
    @Override
    public void updateOneSummary(SummaryUpdVo suv) {
        SummaryEntity zpddbz =summaryRepository.findById(suv.getId()).orElse(null);
        if (zpddbz==null){
            throw new BusinessException("查询异常，请稍后再试");
        }
        saveAndDeleteImages(suv, zpddbz);
        zpddbz.setModday(LocalDate.now());
        zpddbz.setTitle(suv.getTitle());
        zpddbz.setEasy(suv.getEasy());
        zpddbz.setKnowledge(suv.getKnowledge());
        zpddbz.setKeyPoints(suv.getKeyPoints());
        zpddbz.setExample(suv.getExample());
        summaryRepository.save(zpddbz);
    }

@Override
public List<CommonEntity> getAllCommon(String subject) {
    List<CommonEntity> bySubject = commonRepository.findBySubject(userService.getUser().getUsername(),subject);
    return bySubject;
}

@Override
public void deleteOneCommon(long id) {
    try{
        commonRepository.logicalDeleteById(id);
        // System.out.println("success");
    }catch(Exception e){
        throw new BusinessException("删除记录时发生异常");
    }
}

@Override
public void updateOneCommon(CommonUpdVo cuv) {
    CommonEntity entity = commonRepository.findById(cuv.getId()).orElse(null);
    if (entity == null) {
        throw new BusinessException("查询异常，请稍后再试");
    }
    saveAndDeleteImages(cuv, entity);
    entity.setModday(LocalDate.now());
    entity.setTitle(cuv.getTitle());
    // 2025/5/6 add important item
    Important[] values = Important.values();
    Important impEnum = values[cuv.getImp() - 1];
    entity.setImp(impEnum);
    entity.setSample(cuv.getSample());
    // 其它字段如有需要可补充
    commonRepository.save(entity);
}

}
