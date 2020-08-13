/** detects if no errors found */
export let isEmptyErrorsObject = (x: object) => {
  if (x == null) {
    return true;
  }

  for (let k in x) {
    let v = x[k as keyof object];
    if (v != null) {
      // if non-empty data found, then it's not empty
      return false;
    }
  }

  return true;
};
