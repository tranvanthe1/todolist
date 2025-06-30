import { useContext, useMemo, useState } from "react";
import { MyContext } from "../App";
import { Table, Select, Input, Button, Upload, Spin, message, Alert, Checkbox, Popconfirm } from "antd";
import type { UploadFile, UploadProps, PopconfirmProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  deleteData,
  editCompleted,
  editData,
  fetchDataFromApi,
  getDataById,
  postData,
} from "../api/todoApi";
import { ColumnsType } from "antd/es/table";
import { Todo } from "../types/todo";
import { useTranslation } from "react-i18next";

import { createFolderIfNotExist, deleteFolderOnSharePoint, deleteFileOnSharePoint, uploadFileToSharePoint } from "../api/sharepointApi";

const TodoApp = () => {

  const context = useContext(MyContext);

  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("vi");

  const [messageApi, contextHolder] = message.useMessage();

  const [newTodo, setNewTodo] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const [spinning, setSpinning] = useState(false);
  
  const totalTodos = context.todos.length;
  const finishedTodos = context.todos.filter(
    (todo: Todo) => !todo?.completed
  ).length;
  
  const handleChangeLanguage = (value: string) => {
    setCurrentLanguage(value);
    i18n.changeLanguage(value);
  };
  
  const handleChangeFilter = (value: string) => {
    setFilterStatus(value);
  };
  
  const filteredTodos = useMemo(() => {
    return context.todos.filter((todo: Todo) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "incomplete") return !todo.completed;
      return true;
    });
  }, [context.todos, filterStatus]);

  const handleUploadChange: UploadProps["onChange"] = (info) => {
    setFileList(info.fileList);
  };

  const toggleTodoStatus = (id: string) => {
    setSpinning(true);
    getDataById<Todo>(`/todo/${id}`).then((res) => {
      const completed = !res.completed;
      editCompleted(`/todo/${id}/completed`, { completed }).then(() => {
        fetchDataFromApi<Todo[]>("/todo").then((res) => {
          context.setTodos(res);
          setSpinning(false);
          messageApi.success(t("update successful"));
        });
      });
    });
  };

  const addTodo = async () => {
    if (!newTodo.trim()) {
      messageApi.error(t("please enter a task"));
      return;
    }
    setSpinning(true);

    const newItem = await postData<Todo>("/todo/add", { title: newTodo });
    const id = newItem.id;

    await createFolderIfNotExist( id );

    const uploadedFiles = [];
    for (let file of fileList) {
      const res = await uploadFileToSharePoint(id, file.originFileObj as File);
      uploadedFiles.push(res.data);
    }

    await editData(`/todo/${id}`, { attachments: uploadedFiles });
    const res = await fetchDataFromApi<Todo[]>("/todo");
    context.setTodos(res);
    setFileList([]);
    setNewTodo("");
    setSpinning(false);
    messageApi.success(t("task added successfully"));
  };

  const deleteTodo = async (id: string) => {
    setSpinning(true);
    try {
      
      await deleteFolderOnSharePoint( id );
      
      await deleteData(`/todo/${id}`);

      const res = await fetchDataFromApi<Todo[]>("/todo");
      context.setTodos(res);

      messageApi.success(t("task and folder deleted successfully"));
    } catch (err) {
      console.error(err);
      messageApi.error(t("error deleting task and folder"));
    } finally {
      setSpinning(false);
    }
  };

  const handleUploadFile = async (todoId: string, file: File) => {
    setSpinning(true);
    try {
      const fileRes = await uploadFileToSharePoint(
        todoId,
        file
      );

      const todo = await getDataById<Todo>(`/todo/${todoId}`);
      const updatedAttachments = [...(todo.attachments || []), fileRes.data];

      await editData(`/todo/${todoId}`, { attachments: updatedAttachments });

      const res = await fetchDataFromApi<Todo[]>("/todo");
      context.setTodos(res);

      messageApi.success(t("file uploaded successfully"));
    } catch (err) {
      console.error(err);
      messageApi.error(t("error uploading file"));
    } finally {
      setSpinning(false);
    }
  };

  const confirm = async (id: string) => {
    await deleteTodo(id);
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
  };

  const handleDeleteFile = async (todoId: string, fileName: string) => {
    setSpinning(true);
    try {
      await deleteFileOnSharePoint( todoId, fileName );

      const todo = await getDataById<Todo>(`/todo/${todoId}`);
      const updatedAttachments = (todo.attachments || []).filter(
        (file) => file.name !== fileName
      );
      await editData(`/todo/${todoId}`, { attachments: updatedAttachments });

      const res = await fetchDataFromApi<Todo[]>("/todo");
      context.setTodos(res);

      messageApi.success(t("file deleted successfully"));
    } catch (err) {
      console.error(err);
      messageApi.error(t("error deleting file"));
    } finally {
      setSpinning(false);
    }
  };

  const handleReplaceFile = async (
    todoId: string,
    oldFileName: string,
    newFile: File
  ) => {
    setSpinning(true);
    try {
      await deleteFileOnSharePoint(todoId, oldFileName);

      const fileRes = await uploadFileToSharePoint(
        todoId,
        newFile
      );

      const todo = await getDataById<Todo>(`/todo/${todoId}`);
      const updatedAttachments = (todo.attachments || [])
        .filter((file) => file.name !== oldFileName)
        .concat(fileRes.data);

      await editData(`/todo/${todoId}`, { attachments: updatedAttachments });

      const res = await fetchDataFromApi<Todo[]>("/todo");
      context.setTodos(res);

      messageApi.success(t("update successful"));
    } catch (err) {
      console.error(err);
      messageApi.error(t("update failed"));
    } finally {
      setSpinning(false);
    }
  };

  const columns: ColumnsType<Todo> = [
    {
      title: t("complete"),
      dataIndex: "completed",
      render: (_: boolean, record: Todo) => (
        <Checkbox
          checked={record.completed}
          onChange={() => toggleTodoStatus(record.id)}
        />
      ),
    },
    {
      title: t("content"),
      dataIndex: "title",
    },
    {
      title: "File",
      dataIndex: "attachments",
      render: (
        attachments: { url: string; name: string }[] = [],
        record: Todo
      ) => (
        <>
          {attachments.map((file, index) => (
            <div key={file.name} className="flex items-center gap-1 my-2">
              <a
                className="w-[120px] whitespace-nowrap overflow-hidden text-ellipsis block"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                >
                {file.name}
              </a>
              <Upload
                showUploadList={false}
                beforeUpload={(newFile) => {
                  handleReplaceFile(record.id, file.name, newFile);
                  return false;
                }}
              >
                <Button size="small"><MdEdit /></Button>
              </Upload>
              <Button
                size="small"
                danger
                onClick={() => handleDeleteFile(record.id, file.name)}
              >
                <RiDeleteBin6Line />
              </Button>
            </div>
          ))}
        </>
      ),
    },
    {
      title: t("action"),
      dataIndex: "",
      key: "x",
      render: (_: any, record: Todo) => (
        <div className="flex">
          <Popconfirm
            className="me-2"
            title="Bạn muốn xóa item này?"
            onConfirm={()=>confirm(record.id) }
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
            size="small"
            danger
          >
            <RiDeleteBin6Line />
          </Button>
          </Popconfirm>
          <Upload
              multiple
              showUploadList={false}
              beforeUpload={(file) => {
                handleUploadFile(record.id, file);
                return false;
              }}
            >
              <Button size="small" icon={<UploadOutlined />}>
              {t("add file")}
              </Button>
          </Upload>
        </div>
        
      ),
    },
  ];

  return (
    <div className="todoApp bg-blue-600 w-full h-full flex justify-center">
      <Spin spinning={spinning} fullscreen />
      {contextHolder}
      <div className="bg-white w-[80vw] h-fit max-w-[1000px] my-8 p-4 rounded-[4px] shadow-sm">
        <div className="flex justify-end mb-2">
          <Select
            defaultValue={currentLanguage}
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
            options={[
              { value: "en", label: "EN" },
              { value: "vi", label: "VN" },
            ]}
          />
        </div>
        <h1 className="uppercase font-bold text-center text-lg sm:text-2xl text-blue-700">
          Todolist
        </h1>
        <div className="mt-2 flex mb-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="me-2 h-[40px]"
            placeholder={t("enter todo items")}
          />
          <Button
            className="h-[40px] uppercase font-bold"
            onClick={addTodo}
            type="primary"
          >
            {t("add")}
          </Button>
        </div>

        <Upload
          multiple
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />}>{t("select file")}</Button>
        </Upload>

        <div className="mt-2">
          <Table
            columns={columns}
            dataSource={filteredTodos}
            scroll={{ x: 700 }}
            rowKey={(record) => record.id}
          />
        </div>

        <div className="grid grid-cols-1 sm:flex">
          <div className="w-full mb-2">
            {finishedTodos ? (
              <Alert
                message={t('task_summary', { finished: finishedTodos, total: totalTodos })}
                type="warning"
              />
            ) : (
              <Alert message={t("all tasks have been completed")} type="success" />
            )}
          </div>
          <div className="flex justify-end mb-2 ms-3">
            <Select
              className="h-[40px]"
              defaultValue="all"
              style={{ width: 120 }}
              onChange={handleChangeFilter}
              options={[
                { value: "all", label: t("all") },
                { value: "completed", label: t("complete") },
                { value: "incomplete", label: t("unfinished") },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
