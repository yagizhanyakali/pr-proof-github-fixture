export interface Address {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
let address: Address = {
  name: 'John Doe',
  street: '123 Main Street',
  city: 'Berlin',
  postalCode: '10115',
  country: 'Germany',
};
export function getAddress() {
  return { ...address };
}
export function saveAddress(next: Address) {
  address = { ...next };
  return getAddress();
}
export function getMode() {
  return process.env.TESTBED_MODE === 'cancel-bug' ? 'cancel-bug' : 'healthy';
}
