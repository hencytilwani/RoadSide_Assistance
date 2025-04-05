import React, { useState } from "react";
import { FaOilCan, FaCarSide, FaWrench } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";

const MaintenanceSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;
      days.push(
        <button
          key={i}
          onClick={() => handleDateChange(new Date(currentYear, currentMonth, i))}
          className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium transition-all shadow-md text-lg ${
            isSelected ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-6 bg-gray-200 min-h-auto flex flex-col items-center">
      <div className="mt-10 flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-2/3">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700 border-b pb-3">
            <MdOutlineEventNote className="text-red-500 text-3xl" /> Maintenance Schedule
          </h2>
          <div className="flex justify-between items-center mt-5">
            <button
              onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="text-gray-700 font-bold text-lg"
            >
              ◀
            </button>
            <h3 className="text-xl font-semibold text-gray-700">
              {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
            </h3>
            <button
              onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="text-gray-700 font-bold text-lg"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center mt-5 text-gray-700 font-semibold text-lg">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center mt-2">{renderCalendar()}</div>
          <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md">+ Add Event</button>
        </div>

        {/* Upcoming Maintenance Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Upcoming Maintenance</h2>
          {[{
            icon: <FaOilCan className="text-yellow-500 text-3xl" />, title: "Oil Change", date: "April 10, 2023", color: "border-yellow-500"
          }, {
            icon: <FaCarSide className="text-yellow-500 text-3xl" />, title: "Tire Replacement", date: "May 20, 2023", color: "border-yellow-500"
          }, {
            icon: <FaWrench className="text-green-500 text-3xl" />, title: "Regular Service", date: "March 15, 2023", color: "border-green-500" }
          ].map(({ icon, title, date, color }, index) => (
            <div key={index} className={`mb-5 p-5 bg-white shadow-lg rounded-lg border-l-4 ${color} flex justify-between items-center` }>
              <div className="flex items-center gap-4">
                {icon}
                <div>
                  <p className="font-semibold text-lg">{title}</p>
                  <p className="text-sm text-gray-500">{date}</p>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md">{index === 2 ? "View Details" : "Schedule Now"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
