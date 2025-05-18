import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUserInfo } from "../store/userSlice";
import { clearSubject } from "../store/subjectSlice";
import { clearRecords } from "../store/recordSlice";
import { clearBackup } from "../store/backupSlice"; // 如果有

export default function LogoutPage(){
    const dispatch = useDispatch();
    const navigate=useNavigate();
    useEffect(()=>{

        // 把 loader 中的逻辑放进来
        // localStorage.removeItem("dpj-sb");
        // localStorage.removeItem("school");
        // localStorage.removeItem("grade");
        // localStorage.removeItem("resetGrade");
        // localStorage.removeItem("subject");
        // localStorage.removeItem("branchDetail");
        // localStorage.removeItem("notebookRecord");
        // localStorage.removeItem("writingRecord");
        // localStorage.removeItem("commonRecord");
        // localStorage.removeItem("wrongRecord");
        // localStorage.removeItem("examRecord");
        // localStorage.removeItem("reviewRecord");
        // localStorage.removeItem("extensionRecord");
        // localStorage.removeItem("long");
        // localStorage.removeItem("token");
        // localStorage.removeItem("expiration");
        dispatch(clearUserInfo());
        dispatch(clearSubject());
        dispatch(clearRecords());
        dispatch(clearBackup()); // 如果有

        navigate('/');
    },[navigate])
}