export interface Address {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  freeTextInformation?: string;
  vatNumber?: string;
  address: Address;
}

export interface CustomerResponse {
  message: string;
  customer: Customer;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string>;
}

