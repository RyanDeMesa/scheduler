export function getAppointmentsForDay(state, day) {
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

export function getInterview(state, interview) {
  // if no interview found, return null
  if (!interview) {
    return null;
  }

  const id = interview.interviewer;

  // if id is a match returns interview object with interviewer details
  if (state.interviewers[id]) {
    return {
      student: interview.student,
      interviewer: state.interviewers[id],
    };
  }
}

export function getInterviewersForDay(state, day) {
  // if days data is empty return empty array
  if (state.days.length === 0) {
    return [];
  }

  // Filter state.days array to find the object who's name matches the provided day
  const filteredDays = state.days.filter((selectedDay) => {
    return day === selectedDay.name;
  });

  //  return empty array if day not found
  if (filteredDays.length === 0) {
    return [];
  }

  // array of interviewers from filteredDays object
  const interviewerIds = filteredDays[0].interviewers;

  // if no interviewers on the given day, return empty array
  if (interviewerIds.length === 0) {
    return [];
  }

  // create variable for resulting interviewers data
  let selectedDayInterviewers = [];

  // iterate through the interviewer array for the given day
  for (const id of interviewerIds) {
    // find interviewers that match the id from apptsFromObj and push into result
    const interviewer = state.interviewers[id];
    selectedDayInterviewers.push(interviewer);
  }
  // return an array of interviewers for the selected day
  return selectedDayInterviewers;
}
