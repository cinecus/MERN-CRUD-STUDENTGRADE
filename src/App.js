import { useEffect, useReducer, useState} from "react";
import "./App.css";
import { reducer ,getGrade} from "./reducer";
import Axios from "axios"
require('dotenv').config()

function App() {
  const initialState = {
    data: []
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const getData = ()=>{
    Axios.get('https://student-grade-api.herokuapp.com/api/v1/student').then((res)=>dispatch({type:'set',payload:res.data.students}))
  }
  useEffect(()=>{
    getData()
  },[])

  const [data, setData] = useState({ id:"",name: "", score: 0, grade: "" });
  const [isEdit,setIsEdit] =useState(false)
  const [isSuccess,setIsSuccess] = useState({add:false,edit:false,delete:false})
  const [isShow,setIsShow]=useState(false)

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const handleAdd = (e) => {
    e.preventDefault();
    const { name, score } = data;
    if (name && score) {
      const newData = {
        id:'643'+(Math.floor(Math.random()*(10000-1000+1))+1000).toString()+'21',
        name,
        score,
        grade:getGrade(score)
      };
      Axios.post('https://student-grade-api.herokuapp.com/api/v1/student',newData).then((res)=>console.log(res))
      dispatch({ type: "add", payload: newData });
      setData({ id:"", name: "", score: 0, grade: "" });
      setIsSuccess({add:true,edit:false,delete:false})
      successAction()
    }
  };
  const handleEdit = (e)=>{
    e.preventDefault()
    const {name,score,id} = data
    
    if(name && score){
      const newData = {
        name,score,id,grade:getGrade(score)
      }
      Axios.patch(`https://student-grade-api.herokuapp.com/api/v1/student/${id}`,newData).then((res)=>console.log(res))
      dispatch({type:'edit', payload:newData})
      setData({ id:"", name: "", score: 0, grade: "" });
      setIsEdit(false)
      setIsSuccess({add:false,edit:true,delete:false})
      successAction()
    }
  }
  const successAction = ()=>{
    setTimeout(()=>{
      setIsSuccess({add:false,edit:false,delete:false})
    },3000)
  }
  const sortByScore = (array) => {
    return array.sort((a, b) => {
      return b.score - a.score;
    });
  };
  sortByScore(state.data);
  return (
    <div>
      <div className="container mt-4">
        <h1 align="center">Student Grade</h1>
        <form>
          <div className="container">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name :
              </label>
              <input
                key="name"
                type="text"
                className="form-control"
                value={data.name}
                onChange={handleChange}
                name="name"
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="score" className="form-label">
                Score :
              </label>
              <input
                key="score"
                type="number"
                className="form-control"
                min="0"
                max="200"
                value={data.score}
                name="score"
                onChange={handleChange}
              ></input>
            </div>
            {!isEdit && <button className="btn btn-primary" onClick={handleAdd}>
              Add
            </button>}
            {isEdit && <button className='btn btn-warning' onClick={handleEdit}>Edit</button>}
            <button className="btn btn-secondary mx-2" onClick={(e)=>{
              e.preventDefault()
              setIsShow(!isShow)}}>
              Show/Hide
            </button>
          </div>
          
        </form>
        {isSuccess.add && <p className="mt-4 mx-3 alert alert-success text-success">เพิ่มข้อมูลสำเร็จ</p> }
        {isSuccess.delete && <p className="mt-4 mx-3 alert alert-danger text-danger">ลบข้อมูลสำเร็จ</p>}
        {isSuccess.edit &&  <p className="mt-4 mx-3 alert alert-warning text-warning">แก้ไขข้อมูลสำเร็จ</p>}
        <hr></hr>
        {isShow && 
        <div>
        <h1 align="center">Student Ranking</h1>
        <div>
          <h6 align="right">Total :{state.data.length} | Max : {state.data.length===0?0:Math.max(...state.data.map(e=>e.score))} | Min : {state.data.length===0?0:Math.min(...state.data.map(e=>e.score))} | Mean : {state.data.length===0?0:(state.data.reduce((total,num)=>total+Number.parseFloat(num.score),0)/state.data.length).toFixed(2)}</h6>
        </div>
        
        <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Score</th>
              <th scope="col">Grade</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          {state.data.map((e, i) => {
            return (
              <tbody key={i}>
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td >{e.id}</td>
                  <td>{e.name}</td>
                  <td>{parseInt(e.score)}</td>
                  <td>{e.grade}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setData({name:e.name,score:e.score,id:e.id})
                        setIsEdit(true)
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>{
                        Axios.delete(`https://student-grade-api.herokuapp.com/api/v1/student/${e.id}`)
                        dispatch({ type: "delete", payload: e.id })
                        setData({ id:"",name: "", score: 0, grade: "" })
                        setIsEdit(false)
                        setIsSuccess({add:false,edit:false,delete:true})
                        successAction()
                      }
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        </div>
        </div>
}
      </div>
    </div>
  );
}

export default App;
