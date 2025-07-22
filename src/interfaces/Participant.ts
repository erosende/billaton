import type { Address } from "../interfaces/Address";

export interface Participant {
  participantId: number;
  identificationNumber: string;
  identificationType: string;
  identificationTypeId: number;
  name: string;
  surnames: string;
  email: string;
  phoneNumber: string;
  participantType: string;
  address: Address;
}

export interface IssuerConfig {
  configId: number;
  issuerId: number;
  vat: number;
  paymentAccountNumber: string;
  logoPath?: string;
}

export const emptyParticipant: Participant = {
  participantId: 0,
  identificationNumber: '',
  identificationType: '',
  identificationTypeId: 2,
  name: '',
  surnames: '',
  email: '',
  phoneNumber: '',
  participantType: 'RECIPIENT',
  address: {
    addressId: 0,
    addressLineOne: '',
    addressLineTwo: '',
    postalCode: '',
    city: '',
    province: ''
  }
}

