import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import GradeForm from '../components/GradeForm';
import Report from '../components/Report';
import AddGrade from '../components/AddGrade';
import StudentAverages from '../components/StudentAverages';
import ClassStudentsAverages from '../components/ClassStudentsAverages';

function DashboardPage() {
  // Pour la démo, utilisez des ID fictifs (à remplacer par de vrais ID issus de votre BDD)
  const [selectedStudentId] = useState('SOME_STUDENT_ID');
  const [selectedSubjectId] = useState('SOME_SUBJECT_ID');

  
  const [selectedClass, setSelectedClass] = useState('6e'); // Par exemple, la classe "6e"

  const refreshGrades = () => {
    // Logique pour rafraîchir les notes si nécessaire
  };

  return (
    <div>

      <Dashboard />
      <hr />
      <AddGrade />

      <hr />
      <Report studentId={selectedStudentId} />

      <hr />
      <StudentAverages studentId={selectedStudentId} />
      <hr />
      <ClassStudentsAverages className={selectedClass} />
    </div>
  );
}

export default DashboardPage;
