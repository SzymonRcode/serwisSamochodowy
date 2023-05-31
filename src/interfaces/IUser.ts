export interface IUserLogin{
  login:string,
  haslo:string
}
export interface IUserID{
  id:number,
  login:string
}
export interface IUser extends IUserLogin{
  imie: string,
  nazwisko: string
}
