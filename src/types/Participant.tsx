export type Participant = {
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

export type Address = {
    addressId: number;
    addressLineOne: string;
    addressLineTwo: string;
    postalCode: string;
    city: string;
    province: string;
}
