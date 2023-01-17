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
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
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
    console.log("id, interview", id, interview);

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

  function cancelInterview(id) {
    const interview = null;
    const appointment = { ...state.appointments[id], interview };
    const appointments = { ...state.appointments, [id]: appointment };

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
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((prev) => ({
          ...prev,
          appointments,
          days,
        }));
      })
      .catch((err) => console.log(err));
    }
    return { state, setDay, bookInterview, cancelInterview, updateSpots };
}
