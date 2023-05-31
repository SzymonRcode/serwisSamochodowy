export interface INaprawy{
  nazwa: string,
  cena: number,
  status: number,
  idAuta: number
}
export interface INaprawyId extends INaprawy{
  id: number
}
