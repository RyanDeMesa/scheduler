import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day: day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // update number of spots for current day
  const updateSpots = (day, days, appointments) => {
    // find the day object in the days array
    const dayObj = days.find((d) => d.name === day);
    let spots = 0;

    for (const id of dayObj.appointments) {
      // get appointment object from appointments object
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    return spots;
  };

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // update the number of spots for the current day
    const spots = updateSpots(state.day, state.days, appointments);
    // update the days object in state
    const days = state.days.map((day) => {
      if (day.name === state.day) {
        return { ...day, spots };
      }
      return day;
    });

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        setState({ ...state, appointments, days });
      });
  }

  const cancelInterview = (id) => {
    // create a new appointment object with the interview set to null
    const appointment = {
      ...state.appointments[id], // get the appointment
      interview: null,
    };

    // update the appointments object in state
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // update the number of spots for the current day
    const spots = updateSpots(state.day, state.days, appointments);

    // update the days object in state
    const days = state.days.map((day) => {
      if (day.name === state.day) {
        return { ...day, spots };
      }
      return day;
    });

    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState({
        ...state,
        appointments,
        days,
      });
    });
  };

  return { state, setDay, bookInterview, cancelInterview, updateSpots };
};
