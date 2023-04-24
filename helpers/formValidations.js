export function maxLengthValidator(value, maxLength) {
  if (value && value.length > maxLength) {
    return Promise.reject(`Maximum ${maxLength} characters.`);
  }
  return Promise.resolve();
}

export function phoneValidator(value) {
  let regex = /^[0-9+-]+$/;

  if (value && !regex.test(value)) {
    return Promise.reject(`Only +, - and digits are allowed!`);
  }
  return Promise.resolve();
}
