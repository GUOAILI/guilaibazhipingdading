import { useNavigate } from "react-router-dom";
import React,{ useEffect } from "react";
import { tokenLoader } from '../util/authentication';
import { notification } from "antd";

const openNotificationWithIcon = (type, message, description) => notification[type]({message, description});

const EmptyLayout = () =>{
    const navigate=useNavigate();
    let jiangshan1=localStorage.getItem("branchDetail");
    let jiangshan = '';
    if (jiangshan1) {
      jiangshan = jiangshan1.slice(jiangshan1.indexOf(' ') + 1);
    }
    useEffect(() => {

        // 2025/5/12 add code here
        const tokenValid = tokenLoader();
          if (!tokenValid) {
              openNotificationWithIcon("error","令牌过期，请重新登录");
              localStorage.removeItem("dpj-sb");
              localStorage.removeItem("school");
              localStorage.removeItem("grade");
              localStorage.removeItem("resetGrade");
              localStorage.removeItem("subject");
              localStorage.removeItem("branchDetail");
              localStorage.removeItem("notebookRecord");
              localStorage.removeItem("writingRecord");
              localStorage.removeItem("commonRecord");
              localStorage.removeItem("wrongRecord");
              localStorage.removeItem("examRecord");
              localStorage.removeItem("reviewRecord");
              localStorage.removeItem("extensionRecord");
              localStorage.removeItem("long");
              localStorage.removeItem("token");
              localStorage.removeItem("expiration");
              navigate('/');
              return;
          }

      switch (jiangshan) {
        case '':
          navigate('/nav/');
          break;
        case '课本':
          navigate('/nav/notebook/list');
          break;
        case '课外扩展':
          navigate('/nav/extension/list');
          break;
        case '写作':
          navigate('/nav/writing/list');
          break;
        case '错题积累':
          navigate('/nav/wrong/list');
          break;
        case '复习':
          navigate('/nav/review/list');
          break;
        case '试卷汇总':
          navigate('/nav/exam/list');
          break;
        // case '苹静':
        case '东珠苹静':
          navigate('/nav/subject');
          break;
        default:
          navigate('/nav/common/list');
          break;
      }      
    }, [jiangshan, navigate]);
      return (
        <>
          <h1 style={{color:'#e32636'}}>
            这是一门新的还没有响应页面的子分类,请联系管理员。
          </h1>
          <button onClick={()=>navigate('/nav')}>返回上一页面</button>
        </>
      )

}
export default EmptyLayout