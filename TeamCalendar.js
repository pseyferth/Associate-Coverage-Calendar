import { useState } from 'react';

const associates = ['Paul', 'Nnamdi', 'Peyton'];
const weeks = generateWeeks('2025-05-05', '2025-08-31');
const options = ['DNS', 'SUBOPTIMAL', 'NO ISSUES'];

function generateWeeks(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const weekArray = [];

  while (startDate <= endDate) {
    const monday = new Date(startDate);
    weekArray.push(monday.toISOString().split('T')[0]);
    startDate.setDate(startDate.getDate() + 7);
  }
  return weekArray;
}

export default function TeamCalendar() {
  const [availability, setAvailability] = useState({});
  const [schedule, setSchedule] = useState({});

  const handleAvailabilityChange = (person, week, value) => {
    setAvailability((prev) => ({
      ...prev,
      [person]: {
        ...(prev[person] || {}),
        [week]: value,
      },
    }));
  };

  const generateSchedule = () => {
    const newSchedule = {};
    weeks.forEach((week) => {
      const candidates = associates
        .filter((person) => availability[person]?.[week] === 'NO ISSUES')
        .concat(
          associates.filter((person) => availability[person]?.[week] === 'SUBOPTIMAL')
        );

      newSchedule[week] = candidates.length > 0 ? candidates[0] : 'Unassigned';
    });
    setSchedule(newSchedule);
  };

  const downloadCSV = () => {
    let csvContent = "Week,Assigned\n";
    weeks.forEach((week) => {
      csvContent += `${week},${schedule[week] || "Pending"}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "coverage_schedule.csv");
    link.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Portfolio and Fund Coverage Scheduler</h1>
      <button onClick={generateSchedule} style={{ marginRight: '10px' }}>Generate Schedule</button>
      <button onClick={downloadCSV}>Download CSV</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {associates.map((person) => (
          <div key={person} style={{ border: '1px solid gray', padding: '10px' }}>
            <h2>{person}</h2>
            {weeks.map((week) => (
              <div key={week}>
                <label>{week}: </label>
                <select
                  value={availability[person]?.[week] || ""}
                  onChange={(e) => handleAvailabilityChange(person, week, e.target.value)}
                >
                  <option value="">--</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '40px' }}>
        <h2>Coverage Calendar</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {weeks.map((week) => (
            <div key={week} style={{ border: '1px solid black', padding: '10px', width: '200px' }}>
              <strong>{week}</strong><br />
              Assigned: {schedule[week] || 'Pending'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}