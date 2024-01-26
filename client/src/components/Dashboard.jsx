import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { Add, Cancel, Delete, Edit } from "@mui/icons-material"




function Dashboard() {
    const { state } = useLocation();
    const { user } = state || {};
    // console.log(user);

    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [selectTaskId , setSelectTaskId] = useState('');
    const [addTask, setAddTask] = useState(false);
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');


    const handleEdit = (id) => {
        setEdit(true);
        const foundRow = rows.find((row) => row.taskId === id);
        setSelectTaskId(id)

        if (foundRow) {
            setSelectedRow(foundRow);
        }
    };



    const handleDelete = async (id) => {

        const res = await axios.post("http://localhost:5500/api/task/deleteTask", {
            taskId: id
        });

        if (res.status == 200) {
            alert("successfully deleted !");
        }

        const updatedRows = rows.filter((row) => row.taskId !== id);
        setRows(updatedRows);
        setSelectedRow(null);
    };

    const handleSaveChanges = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5500/api/task/update",{
                taskId:selectTaskId,
                title:selectedRow.title,
                description:selectedRow.description,
                dueDate:selectedRow.dueDate
            });
            if(res.status==200){
                alert("successFully Updated !")
            }
        }catch(err){
            console.log(err)
        }

    }

    const handleAddTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5500/api/task/addTask", {
                userId: user.userId,
                title: title,
                description: description,
                dueDate: dueDate,
            });
            if (res.status >= 200 && res.status < 300) {
                alert("Task added successfully");
            } else {
                console.error("Failed to add task. Server responded with status:", res.status);
                if (res.status === 401) {
                    console.log("Unauthorized access. Redirect to login?");
                }
            }
        } catch (error) {
            console.error("Error adding task:", error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:5500/api/task/getTasks", {
                    userId: user.userId,
                });

                setRows(res.data);

            } catch (error) {
                console.error('Error adding task:', error.message);
            }
        };

        fetchData();
    }, [user.userId]);






    return (
        <div className='p-5'>
            <div className='text-5xl font-bold'>Task <span className='text-blue-700 '>Management</span></div>
            <div className="container mx-auto p-8 mt-5">
                <span className='text-3xl '>Welcome {user.username}</span>
                <div className="mt-8">
                    <table className="min-w-full  shadow-xl rounded-2xl ">
                        <thead className='bg-dark text-light'>
                            <tr>

                                <th className="border-b p-3">Title</th>
                                <th className="border-b p-3">Description</th>
                                <th className="border-b p-3">Due Date</th>
                                <th className="border-b p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {rows.map((row) => (
                                <tr key={row.taskId}>

                                    <td className="border-b p-2">{row.title}</td>
                                    <td className="border-b p-2">{row.description}</td>
                                    <td className="border-b p-2">{row.dueDate}</td>
                                    <td className="border-b p-2">
                                        <button
                                            className="text-blue-500  px-2 py-1 mr-2"
                                            onClick={() => handleEdit(row.taskId)}
                                        >
                                            <Edit />
                                        </button>
                                        <button
                                            className=" text-red-500 px-2 py-1 "
                                            onClick={() => handleDelete(row.taskId)}
                                        >
                                            <Delete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
            <div className='w-[80px] h-[80px] flex justify-center items-center cursor-pointer rounded-full fixed bottom-20 left-20 bg-blue-700 text-white p-5' onClick={() => setAddTask(true)}>
                <Add className='' fontSize="large" />
            </div>
            {addTask && (
                <div className='p-2 w-[900px] h-[450px] bg-white shadow-2xl border rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>

                    <div className='text-3xl font-bold text-center mt-3'>Add<span className='text-blue-700 '> Task</span></div>
                    <Cancel className='absolute top-5 right-5 cursor-pointer text-red-500 ' fontSize='large' onClick={() => setAddTask(false)} />
                    <form onSubmit={handleAddTask} className='p-5 flex mt-5 flex-col gap-3'>
                        <input type="text" placeholder='Enter Title' className='border p-3 w-full form-control ' onChange={(e) => setTitle(e.target.value)} required />
                        <textarea type="text" placeholder='Enter Description' className='border p-3 w-full form-control ' onChange={(e) => setDescription(e.target.value)} required ></textarea>
                        <input type="date" placeholder='Enter Due Date' className='border p-3 w-full form-control ' onChange={(e) => setDueDate(e.target.value)} required />

                        <button className='bg-blue-500 font-bold  text-white p-2  w-full hover:bg-blue-600 mt-5 shadow-2xl'>Add</button>
                    </form>
                </div>

            )}
           {edit && selectedRow && (
        <div className='p-2 w-[900px] h-[450px] bg-white shadow-2xl border rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='text-3xl font-bold text-center mt-3'>Edit<span className='text-blue-700 '> Task</span></div>
          <Cancel
            className='absolute top-5 right-5 cursor-pointer text-red-500 '
            fontSize='large'
            onClick={() => setEdit(false)}
          />
          <form onSubmit={handleSaveChanges} className='p-5 flex mt-5 flex-col gap-3'>
            
            <input
              type="text"
              placeholder='Enter Title'
              className='border p-3 w-full form-control'
              value={selectedRow.title || ''}
              onChange={(e) => setSelectedRow({ ...selectedRow, title: e.target.value })}
            />
            <textarea
              type="text"
              placeholder='Enter Description'
              value={selectedRow.description || ''}
              className='border p-3 w-full form-control'
              onChange={(e) => setSelectedRow({ ...selectedRow, description: e.target.value })}
            ></textarea>
            <input
              type="date"
              placeholder='Enter Due Date'
              className='border p-3 w-full form-control'
              onChange={(e) => setSelectedRow({ ...selectedRow, dueDate: e.target.value })}
              value={selectedRow.dueDate || ''}
            />

            <button className='bg-blue-500 font-bold  text-white p-2  w-full hover:bg-blue-600 mt-5 shadow-2xl'>
              Save Changes
            </button>
          </form>
        </div>
      )}

        </div>
    )
}

export default Dashboard
