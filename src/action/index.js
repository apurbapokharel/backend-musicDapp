export const assignIdentifier = (value) => {
    return {
      type: "ASSIGNMENT",
      payload: value,
    };
  };