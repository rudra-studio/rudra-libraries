import React from 'react';
import './styles.module.scss';

interface ResumeSectionProps {
  name: string;
  role: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ name, role, experience, skills, education }) => {
  return (
    <div className="resume-section">
      <header className="resume-header">
        <h1>{name}</h1>
        <h2>{role}</h2>
      </header>
      <section className="resume-experience">
        <h3>Experience</h3>
        {experience.map((exp, index) => (
          <div key={index} className="resume-experience-item">
            <h4>{exp.company}</h4>
            <h5>{exp.position}</h5>
            <p>{exp.startDate} - {exp.endDate}</p>
            <ul>
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="resume-skills">
        <h3>Skills</h3>
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className="resume-education">
        <h3>Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="resume-education-item">
            <h4>{edu.institution}</h4>
            <h5>{edu.degree}</h5>
            <p>{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResumeSection;