import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import axios from "axios";

const props = {
  action: "http://localhost:3000/upload",
  beforeUpload: (file) => {
    let flag = true;
    if (!file?.name.toLowerCase().endsWith(".xlsx")) {
      flag = false;
      message.error(`必须上传xlsx格式文件`);
    }
    return flag || Upload.LIST_IGNORE;
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  maxCount: 1,
};


const App = () => {
  const [loading, setLoading] = useState(false);
  const handleExport = () => {
    setLoading(true)
    axios
      .get("http://localhost:3000/export", {
        responseType: "blob", // 重要：指定响应类型为blob
      })
      .then((response) => {
        setLoading(false)
        console.log(response.data, "response.data");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.xlsx"); // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        setLoading(false)
        console.error("导出失败:", error);
      });
  };
  return (
    <div>
      <Upload name="companyFile" {...props}>
        <Button icon={<UploadOutlined />}>上传公司文件</Button>
      </Upload>
      <Upload name="customerFile" {...props}>
        <Button icon={<UploadOutlined />}>上传客户文件</Button>
      </Upload>
      <Button onClick={handleExport}>确定1</Button>
      <div>{loading ? "正在分析中..." : "分析完毕，请查看浏览器下载列表"}</div>
    </div>
  );
}

  

export default App;
