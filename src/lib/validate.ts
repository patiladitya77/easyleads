export const validateData = (
  email: string,
  password: string
): string | null => {
  const isEmailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const isPawwordvalid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
  if (!isEmailValid) return "Email is not valid";
  if (!isPawwordvalid) return "Please enter valid password";
  return null;
};
