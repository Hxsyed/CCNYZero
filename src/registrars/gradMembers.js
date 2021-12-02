import './gradMembers.css';
import { collection, doc, deleteDoc, onSnapshot, setDoc,updateDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from "../firebase.js";
import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useHistory } from 'react-router-dom';
import StudentcourseAssignPopup from './StudentDeregister';

var StudentRegisterUiid;
export default function GradMembers(){
  const string = "You have been warned by the registrar after a complain investigation!"
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [complains, setComplains] = useState([]);
  const [Reviews, setReviews] = useState([]);
  const [studentscourses, setStudentscourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [CanceledCourses, setCanceledCourses] = useState([]);

  // POP UP FUNCTIONS 
  const togglestudentcoursePopup = () => {
    setIsOpen(!isOpen);
}
const closetogglestudentcoursePopup = () => {
    setIsOpen(!isOpen);
}
  // GET WAITLIST
  async function getWaitlist(db) {
    const waitlistCol = collection(db, 'Waitlist');
    setLoading(true);
    onSnapshot(waitlistCol, (querySnapshot) => {
      const waitlist = [];
      querySnapshot.forEach((doc) => {
        waitlist.push(doc.id);
      });
      setWaitlist(waitlist);
    });
    setLoading(false);
  }
  // COMPLAIN AND REVIEW
  async function getComplaint(db) {
    const complainsCol = collection(db, 'Complaints');
    const complainsColid = collection(db, 'Complaints');
    setLoading(true);
    onSnapshot(complainsCol, (querySnapshot) => {
      let complain = [];
      querySnapshot.forEach((doc) => {
        complain.push(doc.data())
      });
      onSnapshot(complainsColid, (querySnapshot) => { 
        const complainid = [];
        querySnapshot.forEach((doc) => {
          complainid.push(doc.id)
        });
        for(let i=0; i<complainid.length; i++){
          complain[i].Uid = complainid[i];
        }
        setComplains(complain)
        });
    });
    setLoading(false);
  }
  
  async function getReviews(db) {
    const reviewsCol = collection(db, 'Reviews');
    const reviewsColid = collection(db, 'Reviews');
    setLoading(true);
    onSnapshot(reviewsCol, (querySnapshot) => {
      const review = [];
      querySnapshot.forEach((doc) => { 
        review.push(doc.data());
      });
      onSnapshot(reviewsColid, (querySnapshot) => {
        const reviewsid = [];
        querySnapshot.forEach((doc) => {
          reviewsid.push(doc.id)
        });
        for(let i=0; i<reviewsid.length; i++){
          review[i].Uid = reviewsid[i];
        }
      setReviews(review);
      });
    });
    setLoading(false);
  }

  async function getStudents(db) {
    const studentsCol = collection(db, 'Students');
    setLoading(true);
   onSnapshot(studentsCol, (querySnapshot) => {
      const student = [];
      querySnapshot.forEach((doc) => {
          student.push(doc.data());
      });
      setStudents(student);
    });
    setLoading(false);
  }

  async function getInstructor(db) {
    const schoolsCol = collection(db, 'Instructor');
    setLoading(true);
    onSnapshot(schoolsCol, (querySnapshot) => {
      const instructor = [];
      querySnapshot.forEach((doc) => {
          instructor.push(doc.data());
      });
      setInstructors(instructor);
    });
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getStudents(db);
    getInstructor(db);
    getReviews(db);
    getComplaint(db);
    getWaitlist(db);
  }, []);

  async function WarningCheckStdCourses(){
    if(doc(db,'gradingperiod', "0t678Obx9SKShD3NR3I4").data().get('classsetup') != 2)     //Checks if the grading period is correct to apply this.
      return;
    for(let i = 0; i< instructors.length; i++){
      let studentID = students[i].useruiid;
      let numOfCourses = students[i].numOfCourses;
      let coursesCanceled = students[i].coursesCanceled;
      if(coursesCanceled == false && numOfCourses < 2)
        StudentWarn(studentID, "Student did not enroll into enough classes: (Min 2)");
    }
  }

  async function SuspensionCheckInstrCourses(){
    if(doc(db,'gradingperiod', "0t678Obx9SKShD3NR3I4").data().get('classsetup') != 2)     //Checks if the grading period is correct to apply this.
      return; 
    for(let i = 0; i <instructors.length; i++){
      let instructorID = instructors[i].useruiid;
      let coursesRemaining = instructors[i].numOfCourses;
      let coursesCanceled = instructors[i].coursesCanceled;
      if(coursesCanceled == true && coursesRemaining == 0)
        Suspend(instructorID);
    }
  }

  async function SuspensionCheckInstrWarnings(){
    for(let i = 0; i< instructors.length; i++){
      let instructorID = instructors[i].useruiid;
      let numOfWarnings = instructors[i].numWarn;
      if(numOfWarnings >= 3)
        Suspend(instructorID);
    }
  }

    async function CancelCourses() {
       if(doc(collection(db,'gradingperiod', "0t678Obx9SKShD3NR3I4")).data().get('classsetup') != 2)     //Checks if the grading period is correct to apply this.
         return;
   
      const coursesCol = query(collection(db,'AssignedCourses'), where("Size" , "<", 5));           //Starts CourseCancellation process

      onSnapshot(coursesCol, (courseSnapshot)=> {       //SetCanceledCourses = True for instructors and warn each one affected.
        courseSnapshot.forEach((doc)=> {
          let instructorID = doc.data().get("Instructoruiid");  //InstructorUiid and courseName is assigned for each instance of a class of Size < 5
          let courseName = doc.data().get("Class");
  
          updateDoc(doc(db,"Instructor", instructorID), {CanceledCourses: true});     //Instructors of these courses are given a CanceledCourse: true
          deleteDoc(doc(db,"Instructor", instructorID, "Courses", courseName));     //Class is deleted from their list of courses.

          collection(db, 'Students', instructorID, "Courses").get().then(snap => {    //reduce numOfCourses -= 1 ;
            let size = snap.size  // will return the collection size 
            updateDoc(doc(db,"Instructor", instructorID), {numOfCourses: size} );
          });

          InstructorWarn(instructorID, "One of your courses has been canceled:" + courseName);                          // They Receive a warning.

          for(let i = 0; i< students.length; i++){        //Checks all students to see if the cancelled course is in their Courses
            let allCoursesStudent = collection(db,"Students",students[i].useruiid, "Courses");
            onSnapshot(allCoursesStudent, (studentSnapshot) => {
              studentSnapshot.forEach((studentCourse) =>{
                if(studentCourse.data().get("Class") != courseName)
                  return;
                
                updateDoc(doc(db,"Students", students[i].useruiid), { CanceledCourses: true }); //Or setDoc with ,{merge: true}
                deleteDoc(doc(db,"Students", students[i].useruiid, "Courses", courseName));
                
                collection(db, 'Students', students[i].useruiid, "Courses").get().then(snap => {    //reduce numOfCourses -= 1 ;
                  let size = snap.size - 1 // will return the collection size
                  updateDoc(doc(db,"Students", students[i].useruiid), {numOfCourses: size} );
                });
              });
            }); 
          }

          deleteDoc(doc(db,"AssignedCourses", courseName)); //Delete the Assigned Course overall.
        });  
      });
    }
  
        
    async function secondChanceEnrollment() {
      if(doc(db,'gradingperiod', "0t678Obx9SKShD3NR3I4").data().get('classsetup') != 2)     //Checks if the grading period is correct to apply this.
        return;
      for(let i = 0; i < students.length; i++){
          let studentID = students[i].useruiid;
          let eachStudent = doc(db, "Students", studentID);
          if(eachStudent.data().get("canceledCourses") == true)
            updateDoc(eachStudent, {registerAllow: true});
          else
            updateDoc(eachStudent, {registerCourse: false});
      }
    }

    async function registrationToRunning() {
      WarningCheckStdCourses(); 
      CancelCourses();
      SuspensionCheckInstrCourses();
      SuspensionCheckInstrWarnings();
      secondChanceEnrollment();
    }
  // IMPLEMENT LATER
  async function StudentWarn(a){ 
    // issue a warning to the student
    for(let i = 0; i<students.length; i++){
      if(students[i].useruiid === a){
          let studentfirstname = students[i].firstname;
          let studentlastname = students[i].lastname;
          let studentuiid = students[i].useruiid;
          var studentdata = students[i];
          var warncount = students[i].numWarn;
          warncount += 1;
          if (warncount>=3){
            // cleare him from the waitlist 
            for(let w = 0; w < waitlist.length; w++){
              if(waitlist[w] === a){
                deleteDoc(doc(db, "Waitlist", a));
              }
            } 
            // delete complain
            for(let c = 0; c < complains.length; c++){
              if(complains[c].SentBy === studentfirstname + " " + studentlastname){
                deleteDoc(doc(db, "Complaints", complains[c].Uid));
              }
            } 
            // delete review
            for(let r = 0; r < Reviews.length; r++){
              if(Reviews[r].SentBy === studentfirstname + " " + studentlastname){
                deleteDoc(doc(db, "Reviews", Reviews[r].Uid));
              }
            }
            // send out an email to the student since he has been suspended to the student's email
            // email template params
            var templateParams = {
              name: studentfirstname + " " + studentlastname,
              message: "You are recieving this message, becuase you have recieved 3 warnigs and you MUST pay $100 in fines to the registrar!",
              from_name: " CCNYZero"
              };
            // email js
            emailjs.send('gmail', 'template_g5n9s3v', templateParams, 'user_n9Gt3cMzwdE1CRjrKfdqY')
            .then((result) => {
            }, (error) => {
            }); 
            // add this student to the suspended collection with data
            await setDoc(doc(db, "SuspendedStudents", studentuiid), studentdata);
            alert("Student has reached 3 warnings and student has been suspended!");
            // delete the student from the student collection       
            await deleteDoc(doc(db, "Students", a));
            await history.push('GradMembers');
          }
          const washingtonRef = doc(db, "Students",a);
          await updateDoc(washingtonRef, {
              numWarn: warncount
          });
          break;
        }
    }
    // add the doc to the warnings
    await addDoc(collection(db, "Students",a,"Warnings"), {
        Warn: string,
        numofWarn: 1
      });
      alert("Student has been warned, please update your Complain list!");
      await history.push('GradMembers');
}

  // IMPLEMENT LATER
  async function InstructorWarn(a){
     // isue a warning to the instructor
    for(let i = 0; i<instructors.length; i++){
      if(instructors[i].useruiid === a){
          var warncount = instructors[i].numWarn;
          warncount += 1;
          const washingtonRef = doc(db, "Instructor",a);
          // Set the "capital" field of the city 'DC'
          await updateDoc(washingtonRef, {
              numWarn: warncount
          });
          break;
        }
    }
  // add the doc to the warnings
  await addDoc(collection(db, "Instructor",a,"Warnings"), {
      Warn: string,
      numofWarn: 1
    });
    alert("Instructor has been warned, please update your Complain list!");
    await history.push('GradMembers');
  }

  // IMPLEMENT LATER
  async function De_Register(a){
    StudentRegisterUiid = a;
    // DEREGISTER THE STUDENT FROM THE COURSE 
    // FIRST WE NEED TO GET THE COURSES FROM THE STUDENT COLLECTION
    const studentCourses = collection(db, 'Students', a,"Courses");
    setLoading(true);
   onSnapshot(studentCourses, (querySnapshot) => {
      const studentcourses = [];
      querySnapshot.forEach((doc) => {
          studentcourses.push(doc.data());
      });
      setStudentscourses(studentcourses);
    });
    setLoading(false);
    togglestudentcoursePopup();
  }
  // IMPLEMENT LATER
  async function De_Register_Popup(a){
    // DEREGISTER THE STUDENT FROM THE COURSE 
    // FIRST WE NEED TO GET THE COURSES FROM THE STUDENT COLLECTION
    await deleteDoc(doc(db, "Students", StudentRegisterUiid,"Courses",a));
    alert("De-Registered the student from the course!");
    await history.push('GradMembers');
  }

  async function Suspend(c){     
      for(let i = 0; i<instructors.length; i++){
        if(instructors[i].useruiid === c){
          var varpush = instructors[i];
         await setDoc(doc(db, "Suspended", c), varpush);
        //  await deleteDoc(doc(db, "Instructor", c), varpush); 
      }
    }
    alert("Instructor has been suspended!");
  }

  return (
    <div className="grad-members">

      <table className = "student-grad-table">
      <h2>Student</h2>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Empl</th>
          <th>UIID</th>
        </tr>
        { students.map((student) => (
        <tr>
          <td> { student.firstname } </td>
          <td> { student.lastname } </td>
          <td> { student.empl } </td>
          <td> { student.useruiid } </td>
          <td><button className="warn-button-grad"onClick={() => StudentWarn(student.useruiid
                                                     )}>Warn</button>
              <button className="de-register-button"onClick={() => De_Register(student.useruiid
                                                     )}>De-register</button></td>                                   
        </tr>
        ))}
      </table>

      <table className = "instructor-grad">
      <h2>Instructor</h2>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>UIID</th>
        </tr>
        { instructors.map((tclass) => (
        <tr>
          <td> { tclass.firstname} </td>
          <td> { tclass.lastname} </td>
          <td> { tclass.useruiid} </td>
          <td> <button className="warn-button-grad2"onClick={() => InstructorWarn(tclass.useruiid
                                                      )}>Warn</button>
                <button className="suspend-button-grad"onClick={() => Suspend(
                                                     tclass.useruiid
                                                     )}>Suspend</button>
          </td>
        </tr>
        ))}
      </table>
      {isOpen && <StudentcourseAssignPopup
            content={<>
                <p>Assign course(s) to this instructor</p>
                <table className="xCourses">
                <tr>
                    <th>Class</th>
                    <th>Day/Time</th>
                    <th>Room</th>
                    <th>Instructor</th>
                    <th>Section</th>
                    <th></th>
                </tr>
                {studentscourses.map((course) => (
                    <tr>
                        <td> {course.Class} </td>
                        <td> {course.DayTime} </td>
                        <td> {course.Room} </td>
                        <td> {course.Instructor} </td>
                        <td> {course.Secion} </td>
                        <td><button onClick= {() => De_Register_Popup(course.Class)}>De-Register Course</button></td>
                    </tr>
                ))}
            </table>
            </>}
            handleClose={closetogglestudentcoursePopup}
             />}

       {/* <button onClick ={() => RegistrationToRunning()}> SuspensionCheck </button> */}
    </div>
  )
};

/*<table className = "instructor-grad">
      <h2>Instructor List</h2>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>UIID</th>
        </tr>
        { Instructor.map((tclass) => (
        <tr>
          <td> { tclass.firstname} </td>
          <td> { tclass.lastname} </td>
          <td> { tclass.useruiid} </td>
          <td> <button className="warn-button-grad2"onClick={() => InstructorWarn(tclass.firstname,
                                                      tclass.lastname
                                                      )}>Warn</button>
                <button className="suspend-button-grad"onClick={() => Suspend(tclass.firstname,
                                                     tclass.lastname
                                                     )}>Suspend</button>
          </td>
        </tr>
        ))}
      </table> */