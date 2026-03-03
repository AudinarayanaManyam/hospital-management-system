export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  registrationDate: string;
  status: 'Active' | 'Admitted' | 'Discharged' | 'OPD';
  insurance?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  qualification: string;
  experience: number;
  status: 'Active' | 'On Leave' | 'Off Duty';
  schedule: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'OPD' | 'IPD' | 'Emergency' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
  notes?: string;
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  type: 'General' | 'ICU' | 'Private' | 'Semi-Private' | 'Emergency';
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  patientId?: string;
  patientName?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes: string;
  status: 'Active' | 'Dispensed' | 'Expired';
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  beds: number;
  staff: number;
  status: 'Active' | 'Inactive';
  phone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Equipment' | 'Consumable' | 'Surgical';
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
  supplier: string;
  expiryDate?: string;
  location: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  services: BillingItem[];
  total: number;
  paid: number;
  balance: number;
  status: 'Pending' | 'Partial' | 'Paid' | 'Insurance';
  insuranceProvider?: string;
}

export interface BillingItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  salary: number;
}

export interface BloodUnit {
  id: string;
  bloodGroup: string;
  units: number;
  donorName: string;
  donationDate: string;
  expiryDate: string;
  status: 'Available' | 'Reserved' | 'Used' | 'Expired';
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  orderedBy: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  result?: string;
}

export interface Ambulance {
  id: string;
  vehicleNo: string;
  type: 'Basic' | 'Advanced' | 'ICU';
  driver: string;
  driverPhone: string;
  status: 'Available' | 'On Call' | 'Maintenance';
  lastLocation?: string;
}

export interface DutyRoster {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  date: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  department: string;
  status: 'Scheduled' | 'Present' | 'Absent' | 'Leave';
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'Normal' | 'Urgent';
}

export interface BirthRecord {
  id: string;
  babyName: string;
  motherName: string;
  fatherName: string;
  dob: string;
  timeOfBirth: string;
  weight: string;
  gender: 'Male' | 'Female';
  doctor: string;
  ward: string;
  certificateNo: string;
}

export interface DeathRecord {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  dod: string;
  timeOfDeath: string;
  cause: string;
  doctor: string;
  ward: string;
  certificateNo: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes: string;
  status: 'Active' | 'Dispensed' | 'Expired';
}
