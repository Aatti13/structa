export const emailValidation = (email)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export const passwordLengthCheck = (password)=>{
  return password.length<6;
}

