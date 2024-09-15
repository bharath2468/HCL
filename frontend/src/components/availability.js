// mockApi.js
import { addDays } from "date-fns";

const availability = {
  "dr-smith": {
    [addDays(new Date(), 1).toISOString().split("T")[0]]: ["09:00", "10:00", "14:00"],
    [addDays(new Date(), 2).toISOString().split("T")[0]]: ["11:00", "13:00", "15:00"],
  },
  "dr-johnson": {
    [addDays(new Date(), 1).toISOString().split("T")[0]]: ["10:00", "11:00", "14:00"],
    [addDays(new Date(), 3).toISOString().split("T")[0]]: ["09:00", "13:00", "16:00"],
  },
};

// Simulate fetching doctor availability
export const getDoctorAvailability = async (doctorId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return availability[doctorId] || {};
};

// Simulate fetching available doctors
export const getAvailableDoctors = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "dr-smith", name: "Dr. Smith - Cardiologist" },
    { id: "dr-johnson", name: "Dr. Johnson - Pediatrician" },
  ];
};
