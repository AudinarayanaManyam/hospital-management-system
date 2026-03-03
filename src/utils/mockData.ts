import type { Patient, Doctor, Appointment, Bed, Department, InventoryItem, Invoice, Staff, BloodUnit, LabTest, Ambulance, DutyRoster, Message, BirthRecord, DeathRecord, Prescription } from '../types';

export const mockPatients: Patient[] = [
  { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '9876543210', email: 'rajesh@email.com', address: '123 MG Road, Hyderabad', bloodGroup: 'O+', registrationDate: '2024-01-15', status: 'Active', insurance: 'Star Health' },
  { id: 'P002', name: 'Priya Sharma', age: 32, gender: 'Female', phone: '9876543211', email: 'priya@email.com', address: '456 Jubilee Hills, Hyderabad', bloodGroup: 'A+', registrationDate: '2024-01-20', status: 'Admitted', insurance: 'HDFC Ergo' },
  { id: 'P003', name: 'Mohammed Ali', age: 58, gender: 'Male', phone: '9876543212', email: 'mali@email.com', address: '789 Banjara Hills, Hyderabad', bloodGroup: 'B+', registrationDate: '2024-02-01', status: 'OPD' },
  { id: 'P004', name: 'Sunita Reddy', age: 27, gender: 'Female', phone: '9876543213', email: 'sunita@email.com', address: '321 Kukatpally, Hyderabad', bloodGroup: 'AB+', registrationDate: '2024-02-10', status: 'Discharged', insurance: 'Bajaj Allianz' },
  { id: 'P005', name: 'Venkat Rao', age: 62, gender: 'Male', phone: '9876543214', email: 'venkat@email.com', address: '654 Secunderabad', bloodGroup: 'O-', registrationDate: '2024-02-15', status: 'Admitted' },
  { id: 'P006', name: 'Lakshmi Devi', age: 38, gender: 'Female', phone: '9876543215', email: 'lakshmi@email.com', address: '987 Ameerpet, Hyderabad', bloodGroup: 'A-', registrationDate: '2024-03-01', status: 'Active', insurance: 'New India' },
];

export const mockDoctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Arun Mehta', specialization: 'Cardiologist', department: 'Cardiology', phone: '9811111111', email: 'arun@hms.com', qualification: 'MBBS, MD, DM', experience: 15, status: 'Active', schedule: 'Mon-Fri 9AM-5PM' },
  { id: 'D002', name: 'Dr. Kavya Nair', specialization: 'Neurologist', department: 'Neurology', phone: '9811111112', email: 'kavya@hms.com', qualification: 'MBBS, MD, DM', experience: 12, status: 'Active', schedule: 'Mon-Sat 10AM-6PM' },
  { id: 'D003', name: 'Dr. Rajan Pillai', specialization: 'Orthopedic', department: 'Orthopedics', phone: '9811111113', email: 'rajan@hms.com', qualification: 'MBBS, MS', experience: 18, status: 'On Leave', schedule: 'Tue-Sat 9AM-4PM' },
  { id: 'D004', name: 'Dr. Sameera Khan', specialization: 'Gynecologist', department: 'Gynecology', phone: '9811111114', email: 'sameera@hms.com', qualification: 'MBBS, MD, DNB', experience: 10, status: 'Active', schedule: 'Mon-Fri 8AM-4PM' },
  { id: 'D005', name: 'Dr. Suresh Babu', specialization: 'Pediatrician', department: 'Pediatrics', phone: '9811111115', email: 'suresh@hms.com', qualification: 'MBBS, DCH, MD', experience: 8, status: 'Active', schedule: 'Mon-Sat 9AM-5PM' },
  { id: 'D006', name: 'Dr. Anita Joshi', specialization: 'General Surgery', department: 'Surgery', phone: '9811111116', email: 'anita@hms.com', qualification: 'MBBS, MS', experience: 20, status: 'Active', schedule: 'Mon-Fri 10AM-5PM' },
];

export const mockDepartments: Department[] = [
  { id: 'DEP01', name: 'Cardiology', head: 'Dr. Arun Mehta', beds: 30, staff: 25, status: 'Active', phone: '040-1111-0001' },
  { id: 'DEP02', name: 'Neurology', head: 'Dr. Kavya Nair', beds: 20, staff: 18, status: 'Active', phone: '040-1111-0002' },
  { id: 'DEP03', name: 'Orthopedics', head: 'Dr. Rajan Pillai', beds: 25, staff: 20, status: 'Active', phone: '040-1111-0003' },
  { id: 'DEP04', name: 'Gynecology', head: 'Dr. Sameera Khan', beds: 35, staff: 30, status: 'Active', phone: '040-1111-0004' },
  { id: 'DEP05', name: 'Pediatrics', head: 'Dr. Suresh Babu', beds: 40, staff: 35, status: 'Active', phone: '040-1111-0005' },
  { id: 'DEP06', name: 'Emergency', head: 'Dr. Anita Joshi', beds: 15, staff: 45, status: 'Active', phone: '040-1111-0006' },
];

export const mockAppointments: Appointment[] = [
  { id: 'APT001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Arun Mehta', department: 'Cardiology', date: '2024-03-15', time: '10:00', type: 'OPD', status: 'Scheduled' },
  { id: 'APT002', patientId: 'P002', patientName: 'Priya Sharma', doctorId: 'D004', doctorName: 'Dr. Sameera Khan', department: 'Gynecology', date: '2024-03-15', time: '11:00', type: 'Follow-up', status: 'Completed' },
  { id: 'APT003', patientId: 'P003', patientName: 'Mohammed Ali', doctorId: 'D002', doctorName: 'Dr. Kavya Nair', department: 'Neurology', date: '2024-03-16', time: '09:30', type: 'OPD', status: 'Scheduled' },
  { id: 'APT004', patientId: 'P004', patientName: 'Sunita Reddy', doctorId: 'D005', doctorName: 'Dr. Suresh Babu', department: 'Pediatrics', date: '2024-03-16', time: '14:00', type: 'Follow-up', status: 'Cancelled' },
  { id: 'APT005', patientId: 'P005', patientName: 'Venkat Rao', doctorId: 'D006', doctorName: 'Dr. Anita Joshi', department: 'Surgery', date: '2024-03-17', time: '08:00', type: 'IPD', status: 'Scheduled' },
];

export const mockBeds: Bed[] = [
  { id: 'B001', number: 'G-101', ward: 'General Ward A', type: 'General', status: 'Occupied', patientId: 'P002', patientName: 'Priya Sharma' },
  { id: 'B002', number: 'G-102', ward: 'General Ward A', type: 'General', status: 'Available' },
  { id: 'B003', number: 'ICU-01', ward: 'ICU', type: 'ICU', status: 'Occupied', patientId: 'P005', patientName: 'Venkat Rao' },
  { id: 'B004', number: 'P-201', ward: 'Private Ward', type: 'Private', status: 'Available' },
  { id: 'B005', number: 'P-202', ward: 'Private Ward', type: 'Private', status: 'Reserved' },
  { id: 'B006', number: 'E-001', ward: 'Emergency', type: 'Emergency', status: 'Available' },
  { id: 'B007', number: 'G-103', ward: 'General Ward A', type: 'General', status: 'Maintenance' },
  { id: 'B008', number: 'S-301', ward: 'Semi-Private', type: 'Semi-Private', status: 'Occupied' },
];

export const mockInventory: InventoryItem[] = [
  { id: 'I001', name: 'Paracetamol 500mg', category: 'Medicine', quantity: 5000, unit: 'Tablets', minStock: 500, price: 2, supplier: 'Cipla', expiryDate: '2025-06-30', location: 'Pharmacy-A1' },
  { id: 'I002', name: 'Surgical Gloves (M)', category: 'Consumable', quantity: 200, unit: 'Pairs', minStock: 50, price: 15, supplier: '3M', location: 'Store-B2' },
  { id: 'I003', name: 'Insulin Syringe', category: 'Consumable', quantity: 45, unit: 'Pieces', minStock: 100, price: 8, supplier: 'BD Medical', expiryDate: '2025-12-31', location: 'Store-A3' },
  { id: 'I004', name: 'ECG Machine', category: 'Equipment', quantity: 3, unit: 'Units', minStock: 1, price: 45000, supplier: 'Philips', location: 'Cardiology' },
  { id: 'I005', name: 'IV Drip Set', category: 'Consumable', quantity: 45, unit: 'Pieces', minStock: 100, price: 25, supplier: 'Romsons', expiryDate: '2025-09-30', location: 'Store-C1' },
  { id: 'I006', name: 'Amoxicillin 250mg', category: 'Medicine', quantity: 800, unit: 'Capsules', minStock: 200, price: 5, supplier: 'Sun Pharma', expiryDate: '2025-03-15', location: 'Pharmacy-A2' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV001', patientId: 'P001', patientName: 'Rajesh Kumar', date: '2024-03-15', services: [{ description: 'OPD Consultation', quantity: 1, rate: 800, amount: 800 }, { description: 'ECG', quantity: 1, rate: 500, amount: 500 }], total: 1300, paid: 1300, balance: 0, status: 'Paid' },
  { id: 'INV002', patientId: 'P002', patientName: 'Priya Sharma', date: '2024-03-14', services: [{ description: 'Room Charges', quantity: 3, rate: 2500, amount: 7500 }, { description: 'Medicines', quantity: 1, rate: 1200, amount: 1200 }], total: 8700, paid: 5000, balance: 3700, status: 'Partial', insuranceProvider: 'HDFC Ergo' },
  { id: 'INV003', patientId: 'P003', patientName: 'Mohammed Ali', date: '2024-03-13', services: [{ description: 'Consultation', quantity: 1, rate: 1000, amount: 1000 }, { description: 'MRI Scan', quantity: 1, rate: 8000, amount: 8000 }], total: 9000, paid: 0, balance: 9000, status: 'Insurance', insuranceProvider: 'Star Health' },
];

export const mockStaff: Staff[] = [
  { id: 'S001', name: 'Ramesh Verma', role: 'Head Nurse', department: 'General Ward', phone: '9900001111', email: 'ramesh@hms.com', joinDate: '2018-05-01', status: 'Active', salary: 45000 },
  { id: 'S002', name: 'Deepa Menon', role: 'Pharmacist', department: 'Pharmacy', phone: '9900001112', email: 'deepa@hms.com', joinDate: '2019-08-15', status: 'Active', salary: 40000 },
  { id: 'S003', name: 'Arjun Singh', role: 'Lab Technician', department: 'Pathology', phone: '9900001113', email: 'arjun@hms.com', joinDate: '2020-01-10', status: 'Active', salary: 35000 },
  { id: 'S004', name: 'Fatima Begum', role: 'Receptionist', department: 'Front Office', phone: '9900001114', email: 'fatima@hms.com', joinDate: '2021-03-20', status: 'Active', salary: 28000 },
  { id: 'S005', name: 'Kiran Kumar', role: 'Ambulance Driver', department: 'Emergency', phone: '9900001115', email: 'kiran@hms.com', joinDate: '2017-11-01', status: 'On Leave', salary: 30000 },
];

export const mockBloodBank: BloodUnit[] = [
  { id: 'BB001', bloodGroup: 'A+', units: 15, donorName: 'Voluntary Donor', donationDate: '2024-02-20', expiryDate: '2024-04-20', status: 'Available' },
  { id: 'BB002', bloodGroup: 'B+', units: 8, donorName: 'Blood Camp', donationDate: '2024-02-25', expiryDate: '2024-04-25', status: 'Available' },
  { id: 'BB003', bloodGroup: 'O+', units: 20, donorName: 'Voluntary Donor', donationDate: '2024-03-01', expiryDate: '2024-05-01', status: 'Available' },
  { id: 'BB004', bloodGroup: 'AB+', units: 5, donorName: 'Corporate Camp', donationDate: '2024-03-05', expiryDate: '2024-05-05', status: 'Reserved' },
  { id: 'BB005', bloodGroup: 'O-', units: 3, donorName: 'Voluntary Donor', donationDate: '2024-01-10', expiryDate: '2024-03-10', status: 'Expired' },
  { id: 'BB006', bloodGroup: 'A-', units: 6, donorName: 'Blood Drive', donationDate: '2024-03-08', expiryDate: '2024-05-08', status: 'Available' },
];

export const mockLabTests: LabTest[] = [
  { id: 'LT001', patientId: 'P001', patientName: 'Rajesh Kumar', testName: 'Complete Blood Count', orderedBy: 'Dr. Arun Mehta', date: '2024-03-15', status: 'Completed', result: 'Normal' },
  { id: 'LT002', patientId: 'P002', patientName: 'Priya Sharma', testName: 'Urine Culture', orderedBy: 'Dr. Sameera Khan', date: '2024-03-15', status: 'In Progress' },
  { id: 'LT003', patientId: 'P003', patientName: 'Mohammed Ali', testName: 'MRI Brain', orderedBy: 'Dr. Kavya Nair', date: '2024-03-14', status: 'Completed', result: 'Mild Cerebral Atrophy' },
  { id: 'LT004', patientId: 'P005', patientName: 'Venkat Rao', testName: 'Troponin Test', orderedBy: 'Dr. Anita Joshi', date: '2024-03-15', status: 'Pending' },
];

export const mockAmbulances: Ambulance[] = [
  { id: 'AMB01', vehicleNo: 'TS09-AB-1234', type: 'Advanced', driver: 'Kiran Kumar', driverPhone: '9900001115', status: 'Available' },
  { id: 'AMB02', vehicleNo: 'TS09-AB-5678', type: 'Basic', driver: 'Sunil Das', driverPhone: '9900001116', status: 'On Call', lastLocation: 'Banjara Hills' },
  { id: 'AMB03', vehicleNo: 'TS09-AB-9012', type: 'ICU', driver: 'Ravi Teja', driverPhone: '9900001117', status: 'Available' },
  { id: 'AMB04', vehicleNo: 'TS09-AB-3456', type: 'Basic', driver: 'Mahesh Rao', driverPhone: '9900001118', status: 'Maintenance' },
];

export const mockDutyRoster: DutyRoster[] = [
  { id: 'DR001', staffId: 'S001', staffName: 'Ramesh Verma', role: 'Head Nurse', date: '2024-03-15', shift: 'Morning', department: 'General Ward', status: 'Present' },
  { id: 'DR002', staffId: 'S002', staffName: 'Deepa Menon', role: 'Pharmacist', date: '2024-03-15', shift: 'Morning', department: 'Pharmacy', status: 'Present' },
  { id: 'DR003', staffId: 'S003', staffName: 'Arjun Singh', role: 'Lab Technician', date: '2024-03-15', shift: 'Morning', department: 'Pathology', status: 'Present' },
  { id: 'DR004', staffId: 'S004', staffName: 'Fatima Begum', role: 'Receptionist', date: '2024-03-15', shift: 'Morning', department: 'Front Office', status: 'Present' },
  { id: 'DR005', staffId: 'S005', staffName: 'Kiran Kumar', role: 'Ambulance Driver', date: '2024-03-15', shift: 'Morning', department: 'Emergency', status: 'Leave' },
];

export const mockMessages: Message[] = [
  { id: 'MSG001', from: 'Dr. Arun Mehta', to: 'Nursing Staff', subject: 'Patient P001 Update', content: 'Please ensure medication schedule is maintained.', timestamp: '2024-03-15T09:30:00', read: false, priority: 'Normal' },
  { id: 'MSG002', from: 'Admin', to: 'All Staff', subject: 'Emergency Drill Tomorrow', content: 'Mandatory emergency drill at 2 PM tomorrow.', timestamp: '2024-03-14T16:00:00', read: true, priority: 'Urgent' },
  { id: 'MSG003', from: 'Pharmacy', to: 'Dr. Sameera Khan', subject: 'Medication Shortage Alert', content: 'Low stock on Oxytocin injections. Please consider alternatives.', timestamp: '2024-03-14T11:00:00', read: false, priority: 'Urgent' },
];

export const mockBirthRecords: BirthRecord[] = [
  { id: 'BR001', babyName: 'Baby Kumar', motherName: 'Priya Kumar', fatherName: 'Suresh Kumar', dob: '2024-03-10', timeOfBirth: '14:35', weight: '3.2 kg', gender: 'Male', doctor: 'Dr. Sameera Khan', ward: 'Maternity Ward B', certificateNo: 'BC-2024-001' },
  { id: 'BR002', babyName: 'Baby Reddy', motherName: 'Ananya Reddy', fatherName: 'Vikram Reddy', dob: '2024-03-12', timeOfBirth: '08:20', weight: '2.9 kg', gender: 'Female', doctor: 'Dr. Sameera Khan', ward: 'Maternity Ward A', certificateNo: 'BC-2024-002' },
];

export const mockDeathRecords: DeathRecord[] = [
  { id: 'DT001', patientName: 'Ram Prasad', age: 78, gender: 'Male', dod: '2024-03-11', timeOfDeath: '23:45', cause: 'Cardiac Arrest', doctor: 'Dr. Arun Mehta', ward: 'ICU', certificateNo: 'DC-2024-001' },
];

export const mockPrescriptions: Prescription[] = [
  { id: 'RX001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Arun Mehta', date: '2024-03-15', diagnosis: 'Hypertension', medicines: [{ name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', quantity: 30 }], notes: 'Avoid salty food.', status: 'Active' },
  { id: 'RX002', patientId: 'P003', patientName: 'Mohammed Ali', doctorId: 'D002', doctorName: 'Dr. Kavya Nair', date: '2024-03-14', diagnosis: 'Migraine', medicines: [{ name: 'Sumatriptan 50mg', dosage: '1 tablet', frequency: 'As needed', duration: '15 days', quantity: 5 }], notes: 'Avoid triggers.', status: 'Active' },
];
