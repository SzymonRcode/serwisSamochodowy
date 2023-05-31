export interface IAuta{
  vin: string,
  nrTablicy: string,
  marka: string,
  rocznik: string,
  przebieg: string,
  idKlienta: number
}
export interface IAutaId extends IAuta{
  id: number
}

