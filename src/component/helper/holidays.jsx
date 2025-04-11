export const holidays = [
    // Example holidays - format is YYYY-MM-DD
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-26', name: "Republic Day" },
    { date: '2025-04-11', name: "Mahaveer Jayanti" }, // Added Mahaveer Jayanti
    { date: '2025-08-15', name: "Independence Day" },
    { date: '2025-10-02', name: "Gandhi Jayanti" },
    { date: '2025-12-25', name: "Christmas Day" },
    // Add more holidays as needed
  ];
  
  export const isHoliday = (dateStr) => {
    return holidays.some(holiday => holiday.date === dateStr);
  };