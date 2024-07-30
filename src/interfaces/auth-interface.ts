export interface RegistrationInput {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface FetchMeInput {
  userId: string;
}
