export interface IUserReducer {
  name: string;
  email: string;
}

export interface IUserAccountPayload extends IUserReducer {
  password: string;
}

export interface IUserAccount {
  [email: string]: {
    name: string;
    password: string;
  };
}
