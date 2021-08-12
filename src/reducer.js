const sortByScore = (array) => {
  return array.sort((a, b) => {
    return b.score - a.score;
  });
};
export const getGrade = (score) => {
  if (score >= 80) {
    return "A";
  } else if (score >= 70) {
    return "B";
  } else if (score >= 60) {
    return "C";
  } else if (score >= 50) {
    return "D";
  } else {
    return "F";
  }
};
export const reducer = (state, action) => {
  if (action.type === "set") {
      const newData = action.payload
      const newState = {...state,data:newData}
      return newState
  }
  if (action.type === "add") {
    const newData = [...state.data, { ...action.payload }];
    const newState = { ...state, data: newData };
    sortByScore(newState.data);
    return newState;
  }
  if (action.type === "delete") {
    const newData = state.data.filter((e) => e.id !== action.payload);
    const newState = { ...state, data: newData };
    return newState;
  }
  if (action.type === "edit") {
    const { id, name, score, grade } = action.payload;
    const newData = state.data.map((e) => {
      if (e.id === id) {
        return { id, name, score, grade };
      } else {
        return e;
      }
    });
    const newState = { ...state, data: newData };
    return newState;
  }
};
