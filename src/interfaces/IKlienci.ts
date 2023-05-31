export interface IKlienci{
  imie: string,
  nazwisko: string,
  pesel: string,
  ulica: string,
  kodPocztowy: string,
  miasto: string
}
export interface IKlienciId extends IKlienci{
  id: number
}


