export default function getAppointmentsForDay(state, day) {

  // returns object matching day
  const matchingDay = state.days.find((days) => days.name === day);

  // if day is not found, return empty object
  if (!matchingDay) return [];

  // returns array of appointment ids for day
  const appointmentIds = matchingDay.appointments;

  // returns a new array where each appointmentId is replaced with it's corresponding appointment details
  const appointmentsList = appointmentIds.map((id) => state.appointments[id]);
  return appointmentsList;
}
