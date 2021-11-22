import './studentView.css'
import { userData } from '../contexts/userProfile';
import { useState, useEffect } from 'react';
import React from 'react'
import { db } from "../firebase.js";
import Tabs from '../components/Tabs';
import { getDoc,collection,onSnapshot } from '@firebase/firestore';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import { FaStar } from "react-icons/fa";

export default function StudentView() {

   const [Student, setStudent] = useState('');
   const [CurrentClasses, setCurrentClasses] = useState([]);
   const [Loading, setLoading] = useState('false');
   const [InputValue, setInputValue] = useState('');
   const [OptionSelected, setOptionSelected] = useState("schedule");
   console.log(OptionSelected);
   const options = [{label: "schedule", value: 0}, {label:"record", value: 1}, {label: "drop", value: 2} , 
                    {label: "enroll", value: 3}, {label:"grades", value: 4}, {label: "complaints", value: 5}, 
                    {label: "rate", value: 6}, {label: "warning", value: 7}];
  // const [ScheduleSelected, setScheduleSelected] = useState('false');

  const handleInputChange = value => {
      setInputValue(value);
  }

  const handleChange = value => {
    setOptionSelected(value);
  }

    async function getStudentCourses(db) {
        const coursesCol = collection(db, 'Students', userData.getUd(),"Courses");
        setLoading(true);
       onSnapshot(coursesCol, (querySnapshot) => {
          const student = [];
          querySnapshot.forEach((doc) => {
              student.push(doc.data());
          });
          console.log(student);
          setCurrentClasses(student);
        });
        setLoading(false);
      }
     async function getWarnings(db){

        // var e = document.getElementById("dd1");
        // var strUser = e;
        // console.log(strUser); // en
        
        function la(src){
        console.log(src); 
        }
     }
    async function getCourses(db){
            
        
            function la(src){
            console.log(src); 
            }
        }
    async function getRoster(db){

        // var e = document.getElementById("dd1");
        // var strUser = e;
        // console.log(strUser); // en
    
        function la(src){
        console.log(src); 
        }                    
    }
        // <select defaultValue={this.state.selectValue} 
 // onChange={this.handleChange} 
    //  async function handleChange(event) {
    //      console.log(event);
    //     //this.setState({value: event.target.value});
    //     // setOptionSelected(this.state.value);
    // }

 useEffect(() => {
    setLoading(true);
    getStudentCourses(db);
  }, []);

  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0)

  const handleClick = value => {
    setCurrentValue(value)
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  }

  const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9"
    
};

    return (
        <div className ='studentPage'>
        <h1 className= "noselect" style = {{color: "White"}}>Welcome!</h1>
        <Container className = "Dropdown" maxWidth = "false">
                <div> 
                    <div className='Card2'>
                        <div className = "upper-container2">  
                            <div className='image-container'>
                                <img src= "https://www.logolynx.com/images/logolynx/ab/ab3cf43cb423c7d9c20eadde6a051a5d.jpeg" alt='' height="100px" width="100px"/>
                            </div>    
                        </div>
                        <div className="lower-container2">
                            <h2>Selection Menu</h2>
                            {/*<label for="options">Choose an option:  </label>*/}
                            <Select className ="Selection" options = { options } value ={OptionSelected} onInputChange = {handleInputChange} onChange = {handleChange}>
                            {/* {options.map((option) => (
                            <option value={option.value}>{option.label}</option>
                            ))}  */}
                            </Select>
                        </div>
                    </div>
                </div>    
        </Container>    

        <Container className= "Display" maxWidth = "false" >
                <div className= "Display" style={{ backgroundColor: "white", height: '80vh' , width: '150vh'}}>
                        {OptionSelected.value == "0" && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    <th> Instructor</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                    <td> { Class.Section } </td>
                                    <td> {Class.Instructor } </td>
                                </tr>
                            ))}
                        </table>    
                        }  
                     
                        {(OptionSelected.value == "1") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }   

                        {(OptionSelected.value == "2") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }  

                        {(OptionSelected.value == "3") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }  

                        {(OptionSelected.value == "4") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }      
                        {(OptionSelected.value == "5") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }       
                        {(OptionSelected.value == "6") && <div style={styles.container}>
                            <h2> Ratings </h2>
                            <div style={styles.stars}>
                            {stars.map((_, index) => {
                                return (
                                    <FaStar
                                    key={index}
                                    size={24}
                                    onClick={() => handleClick(index + 1)}
                                    onMouseOver={() => handleMouseOver(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
                                    style={{
                                        marginRight: 10,
                                        cursor: "pointer"
                                    }}
                                    />
                                )
                             })}
                            </div>
                                <textarea placeholder="What's your experience?" style={styles.textarea} />

                            <button style={styles.button}> Submit </button>
      
                     </div>  
                        }   
                        {(OptionSelected.value == "7") && <table className = "CourseStyler">
                                <tr>
                                    <th>Class</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            { CurrentClasses.map((Class) => (
                                <tr>
                                    <td> { Class.Class } </td>
                                    <td> { Class.DayTime } </td>
                                    <td> { Class.Room } </td>
                                </tr>
                            ))}
                        </table>    
                        }     
                </div>
            </Container>  

        <Container className = "MyInfo" maxWidth = "false">
            <div className ="MyInfo">
                    <div className='Card'>
                    <div className='upper-container'>
                            <div className='image-container'>
                                <img src= "https://i.pravatar.cc/150?img=56" alt='' height="100px" width="100px"/>
                            </div>
                    </div>
                    <div className="lower-container">
                            <h3>Student Information</h3>
                            <p>First Name: {userData.getFirstname()}</p>
                            <p>Last Name: {userData.getLastname()}</p>
                            <p>Date of Birth: {userData.getDob()}</p>
                            <p>GPA: {userData.getGPA()}</p>
                            <p>EMPL: {userData.getEmpl()}</p>
                            <p>Email: {userData.getEmail()}</p>
                    </div>
                </div>
            </div> 
        </Container>                    
        
            {/*<div label="Schedule" onClick = {getCourses}>
                        <table className = "CourseStyler">
                            <tr>
                                <th>Class</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Meeting Times</th>
                                <th> Enrolled</th>
                            </tr>
                        { CurrentClasses.map((Class) => (
                            <tr>
                                <td> { Class.name } </td>
                                <td> { Class.time } </td>
                                <td> { Class.location } </td>
                                <td> { Class.date } </td>
                                <td> {Class.Enrolled } </td>
                            </tr>
                        ))}
                        </table>
                        </div>*/}
          
              {/* <form classname="dd" id="dd1"> */}

                        {/* <input type="submit" value="Submit"/> */}
            {/* /</div>/</form>    */}
        </div>

    
    );
}

const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    stars: {
      display: "flex",
      flexDirection: "row",
    },
    textarea: {
      border: "1px solid #a9a9a9",
      borderRadius: 5,
      padding: 10,
      margin: "20px 0",
      minHeight: 100,
      width: 300
    },
    button: {
      border: "1px solid #a9a9a9",
      borderRadius: 5,
      width: 300,
      padding: 10,
    }
  
  };

/* <Container className = "MyInfo" maxWidth = "sm">
                <Typography component="div" style={{ backgroundColor: 'Green'}}>
                    <div>
                        <div>Student Information</div>       
                        { Studentaboutme() }
                    </div>
                </Typography>
            </Container>  */