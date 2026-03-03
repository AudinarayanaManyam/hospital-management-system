import type { Patient, Doctor, Appointment, Bed, Staff, InventoryItem, Ambulance, Message, DutyRoster, LabTest, Prescription } from '../types';

export const patients: Patient[] = [
  { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '9876543210', email: 'rajesh@email.com', address: '12 MG Road, Delhi', bloodGroup: 'B+', registrationDate: '2024-01-10', status: 'Active', insurance: 'Star Health' },
  { id: 'P002', name: 'Sunita Devi', age: 32, gender: 'Female', phone: '9876543211', email: 'sunita@email.com', address: '45 Lajpat Nagar, Delhi', bloodGroup: 'O+', registrationDate: '2024-01-12', status: 'Active' },
  { id: 'P003', name: 'Arun Verma', age: 60, gender: 'Male', phone: '9876543212', email: 'arun@email.com', address: '78 Civil Lines, Jaipur', bloodGroup: 'A+', registrationDate: '2024-01-08', status: 'Admitted', insurance: 'HDFC Ergo' },
  { id: 'P004', name: 'Priya Patel', age: 28, gender: 'Female', phone: '9876543213', email: 'priya@email.com', address: '23 Sector 15, Gurgaon', bloodGroup: 'AB-', registrationDate: '2024-01-15', status: 'OPD' },
  { id: 'P005', name: 'Mohammed Ali', age: 52, gender: 'Male', phone: '9876543214', email: 'mali@email.com', address: '56 Old City, Hyderabad', bloodGroup: 'O-', registrationDate: '2024-01-01', status: 'Discharged' },
  { id: 'P006', name: 'Kavita Sharma', age: 38, gender: 'Female', phone: '9876543215', email: 'kavita@email.com', address: '90 Park Street, Mumbai', bloodGroup: 'B-', registrationDate: '2024-01-14', status: 'Active', insurance: 'New India' },
  { id: 'P007', name: 'Deepak Singh', age: 41, gender: 'Male', phone: '9876543216', email: 'deepak@email.com', address: '34 Gandhi Nagar, Ahmedabad', bloodGroup: 'A-', registrationDate: '2024-01-13', status: 'Active' },
  { id: 'P008', name: 'Asha Reddy', age: 55, gender: 'Female', phone: '9876543217', email: 'asha@email.com', address: '12 Jubilee Hills, Hyderabad', bloodGroup: 'AB+', registrationDate: '2024-01-15', status: 'OPD' },
];

export const doctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Priya Sharma', specialization: 'Cardiologist', department: 'Cardiology', phone: '9811000001', email: 'priya.sharma@hospital.com', status: 'Active', experience: 15, qualification: 'MBBS, MD, DM Cardiology', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D002', name: 'Dr. Meena Gupta', specialization: 'Gynecologist', department: 'Gynecology', phone: '9811000002', email: 'meena.gupta@hospital.com', status: 'Active', experience: 10, qualification: 'MBBS, MS Gynecology', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D003', name: 'Dr. Suresh Mehta', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', phone: '9811000003', email: 'suresh.mehta@hospital.com', status: 'Active', experience: 20, qualification: 'MBBS, MS Orthopedics, MCh', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D004', name: 'Dr. Nisha Kapoor', specialization: 'Dermatologist', department: 'Dermatology', phone: '9811000004', email: 'nisha.kapoor@hospital.com', status: 'Off Duty', experience: 8, qualification: 'MBBS, MD Dermatology', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D005', name: 'Dr. Ramesh Rao', specialization: 'Neurologist', department: 'Neurology', phone: '9811000005', email: 'ramesh.rao@hospital.com', status: 'Active', experience: 18, qualification: 'MBBS, MD, DM Neurology', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D006', name: 'Dr. Vikram Joshi', specialization: 'ENT Specialist', department: 'ENT', phone: '9811000006', email: 'vikram.joshi@hospital.com', status: 'Active', experience: 12, qualification: 'MBBS, MS ENT', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D007', name: 'Dr. Sanjay Patel', specialization: 'Pulmonologist', department: 'Pulmonology', phone: '9811000007', email: 'sanjay.patel@hospital.com', status: 'Active', experience: 14, qualification: 'MBBS, MD Pulmonology', schedule: 'Mon-Fri 09:00-17:00' },
  { id: 'D008', name: 'Dr. Lakshmi Rao', specialization: 'Endocrinologist', department: 'Endocrinology', phone: '9811000008', email: 'lakshmi.rao@hospital.com', status: 'Active', experience: 16, qualification: 'MBBS, MD, DM Endocrinology', schedule: 'Mon-Fri 09:00-17:00' },
];

export const appointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', date: '2024-01-16', time: '09:00', type: 'Follow-up', status: 'Scheduled' },
  { id: 'A002', patientId: 'P002', patientName: 'Sunita Devi', doctorId: 'D002', doctorName: 'Dr. Meena Gupta', department: 'Gynecology', date: '2024-01-16', time: '10:30', type: 'OPD', status: 'Completed' },
  { id: 'A003', patientId: 'P004', patientName: 'Priya Patel', doctorId: 'D004', doctorName: 'Dr. Nisha Kapoor', department: 'Dermatology', date: '2024-01-16', time: '11:00', type: 'OPD', status: 'Scheduled' },
  { id: 'A004', patientId: 'P005', patientName: 'Mohammed Ali', doctorId: 'D005', doctorName: 'Dr. Ramesh Rao', department: 'Neurology', date: '2024-01-15', time: '14:00', type: 'IPD', status: 'Completed' },
  { id: 'A005', patientId: 'P006', patientName: 'Kavita Sharma', doctorId: 'D006', doctorName: 'Dr. Vikram Joshi', department: 'ENT', date: '2024-01-16', time: '15:00', type: 'OPD', status: 'Scheduled' },
  { id: 'A006', patientId: 'P007', patientName: 'Deepak Singh', doctorId: 'D007', doctorName: 'Dr. Sanjay Patel', department: 'Pulmonology', date: '2024-01-16', time: '16:00', type: 'Emergency', status: 'Scheduled' },
];

export const beds: Bed[] = [
  { id: 'B001', number: '101', ward: 'General Ward A', type: 'General', status: 'Occupied', patientId: 'P001', patientName: 'Rajesh Kumar' },
  { id: 'B002', number: '102', ward: 'General Ward A', type: 'General', status: 'Available' },
  { id: 'B003', number: '103', ward: 'General Ward A', type: 'General', status: 'Maintenance' },
  { id: 'B004', number: '201', ward: 'ICU', type: 'ICU', status: 'Occupied', patientId: 'P003', patientName: 'Arun Verma' },
  { id: 'B005', number: '202', ward: 'ICU', type: 'ICU', status: 'Available' },
  { id: 'B006', number: '301', ward: 'Private Ward', type: 'Private', status: 'Occupied', patientId: 'P002', patientName: 'Sunita Devi' },
  { id: 'B007', number: '302', ward: 'Private Ward', type: 'Private', status: 'Available' },
  { id: 'B008', number: '401', ward: 'Semi-Private Ward', type: 'Semi-Private', status: 'Occupied', patientId: 'P006', patientName: 'Kavita Sharma' },
  { id: 'B009', number: '402', ward: 'Semi-Private Ward', type: 'Semi-Private', status: 'Available' },
  { id: 'B010', number: '403', ward: 'Semi-Private Ward', type: 'Semi-Private', status: 'Available' },
  { id: 'B011', number: '104', ward: 'General Ward B', type: 'General', status: 'Occupied', patientId: 'P007', patientName: 'Deepak Singh' },
  { id: 'B012', number: '105', ward: 'General Ward B', type: 'General', status: 'Available' },
];

export const staff: Staff[] = [
  { id: 'S001', name: 'Anita Singh', role: 'Head Nurse', department: 'Nursing', phone: '9900000001', email: 'anita.singh@hospital.com', joinDate: '2020-03-15', status: 'Active', salary: 45000 },
  { id: 'S002', name: 'Rajan Mehta', role: 'Lab Technician', department: 'Pathology', phone: '9900000002', email: 'rajan.mehta@hospital.com', joinDate: '2021-06-20', status: 'Active', salary: 35000 },
  { id: 'S003', name: 'Sushma Yadav', role: 'Pharmacist', department: 'Pharmacy', phone: '9900000003', email: 'sushma.yadav@hospital.com', joinDate: '2019-11-10', status: 'Active', salary: 40000 },
  { id: 'S004', name: 'Rohit Kumar', role: 'Radiologist Tech', department: 'Radiology', phone: '9900000004', email: 'rohit.kumar@hospital.com', joinDate: '2022-01-05', status: 'On Leave', salary: 38000 },
  { id: 'S005', name: 'Pooja Sharma', role: 'Case Manager', department: 'Administration', phone: '9900000005', email: 'pooja.sharma@hospital.com', joinDate: '2020-08-22', status: 'Active', salary: 42000 },
  { id: 'S006', name: 'Vijay Patil', role: 'Ambulance Driver', department: 'Emergency', phone: '9900000006', email: 'vijay.patil@hospital.com', joinDate: '2018-05-30', status: 'Active', salary: 30000 },
];


export const inventoryItems: InventoryItem[] = [
  { id: 'I001', name: 'Paracetamol 500mg', category: 'Medicine', quantity: 5000, unit: 'Tablets', minStock: 1000, expiryDate: '2025-06-30', supplier: 'Sun Pharma', price: 2.5, location: 'Pharmacy A' },
  { id: 'I002', name: 'Surgical Gloves (M)', category: 'Surgical', quantity: 200, unit: 'Pairs', minStock: 500, supplier: 'MedLine', price: 15, location: 'OR Storage' },
  { id: 'I003', name: 'Saline 500ml', category: 'Consumable', quantity: 150, unit: 'Bottles', minStock: 100, expiryDate: '2024-12-31', supplier: 'B. Braun', price: 45, location: 'Ward A' },
  { id: 'I004', name: 'Syringes 5ml', category: 'Consumable', quantity: 2000, unit: 'Pieces', minStock: 500, expiryDate: '2026-01-01', supplier: 'Dispovan', price: 3, location: 'Med Store' },
  { id: 'I005', name: 'Insulin 100IU', category: 'Medicine', quantity: 80, unit: 'Vials', minStock: 50, expiryDate: '2024-09-30', supplier: 'Novo Nordisk', price: 350, location: 'Pharmacy B' },
  { id: 'I006', name: 'BP Monitor', category: 'Equipment', quantity: 15, unit: 'Units', minStock: 5, supplier: 'Omron', price: 2500, location: 'Equipment Room' },
  { id: 'I007', name: 'N95 Masks', category: 'Consumable', quantity: 300, unit: 'Pieces', minStock: 200, expiryDate: '2025-03-31', supplier: '3M', price: 45, location: 'PPE Store' },
  { id: 'I008', name: 'Amoxicillin 500mg', category: 'Medicine', quantity: 120, unit: 'Strips', minStock: 200, expiryDate: '2025-08-15', supplier: 'Cipla', price: 65, location: 'Pharmacy A' },
];

export const bloodBankData = [
  { bloodGroup: 'A+', units: 45, lastUpdated: '2024-01-15', status: 'Adequate' },
  { bloodGroup: 'A-', units: 8, lastUpdated: '2024-01-15', status: 'Low' },
  { bloodGroup: 'B+', units: 62, lastUpdated: '2024-01-15', status: 'Surplus' },
  { bloodGroup: 'B-', units: 5, lastUpdated: '2024-01-15', status: 'Critical' },
  { bloodGroup: 'O+', units: 35, lastUpdated: '2024-01-15', status: 'Adequate' },
  { bloodGroup: 'O-', units: 12, lastUpdated: '2024-01-15', status: 'Low' },
  { bloodGroup: 'AB+', units: 28, lastUpdated: '2024-01-15', status: 'Adequate' },
  { bloodGroup: 'AB-', units: 3, lastUpdated: '2024-01-15', status: 'Critical' },
];

export const ambulances: Ambulance[] = [
  { id: 'AMB001', vehicleNo: 'DL 01 AM 0001', driver: 'Vijay Patil', driverPhone: '9900000006', status: 'Available', type: 'Basic' },
  { id: 'AMB002', vehicleNo: 'DL 01 AM 0002', driver: 'Ramesh Gupta', driverPhone: '9900000007', status: 'On Call', type: 'Advanced' },
  { id: 'AMB003', vehicleNo: 'DL 01 AM 0003', driver: 'Suresh Kumar', driverPhone: '9900000008', status: 'Maintenance', type: 'ICU' },
  { id: 'AMB004', vehicleNo: 'DL 01 AM 0004', driver: 'Ravi Shankar', driverPhone: '9900000009', status: 'Available', type: 'Advanced' },
];

export const messages: Message[] = [
  { id: 'M001', from: 'Dr. Priya Sharma', to: 'Admin', subject: 'Patient Transfer Request', content: 'Please arrange transfer of patient P001 to ICU immediately.', timestamp: '2024-01-15 09:30', read: false, priority: 'Urgent' },
  { id: 'M002', from: 'Pharmacy', to: 'Dr. Ramesh Rao', subject: 'Medication Stock Alert', content: 'Insulin stock running low. Please review prescriptions.', timestamp: '2024-01-15 10:00', read: true, priority: 'Normal' },
  { id: 'M003', from: 'Lab', to: 'Dr. Meena Gupta', subject: 'Test Results Ready', content: 'Blood reports for patient P002 are ready for review.', timestamp: '2024-01-15 11:15', read: false, priority: 'Normal' },
  { id: 'M004', from: 'Admin', to: 'All Staff', subject: 'Holiday Schedule', content: 'Please note the revised duty roster for upcoming holidays.', timestamp: '2024-01-14 14:00', read: true, priority: 'Normal' },
  { id: 'M005', from: 'Dr. Vikram Joshi', to: 'Pharmacy', subject: 'Prescription Query', content: 'Please clarify dosage for patient P006 prescribed medication.', timestamp: '2024-01-15 12:30', read: false, priority: 'Normal' },
];

export const dutyRoster: DutyRoster[] = [
  { id: 'DR001', staffId: 'S001', staffName: 'Anita Singh', role: 'Head Nurse', department: 'Nursing', date: '2024-01-16', shift: 'Morning', status: 'Present' },
  { id: 'DR002', staffId: 'S002', staffName: 'Rajan Mehta', role: 'Lab Tech', department: 'Pathology', date: '2024-01-16', shift: 'Morning', status: 'Present' },
  { id: 'DR003', staffId: 'S003', staffName: 'Sushma Yadav', role: 'Pharmacist', department: 'Pharmacy', date: '2024-01-16', shift: 'Morning', status: 'Absent' },
  { id: 'DR004', staffId: 'S006', staffName: 'Vijay Patil', role: 'Driver', department: 'Emergency', date: '2024-01-16', shift: 'Afternoon', status: 'Scheduled' },
  { id: 'DR005', staffId: 'S005', staffName: 'Pooja Sharma', role: 'Case Manager', department: 'Administration', date: '2024-01-16', shift: 'Morning', status: 'Present' },
  { id: 'DR006', staffId: 'S004', staffName: 'Rohit Kumar', role: 'Radiologist Tech', department: 'Radiology', date: '2024-01-16', shift: 'Night', status: 'Scheduled' },
];

export const labTests: LabTest[] = [
  { id: 'LT001', patientId: 'P001', patientName: 'Rajesh Kumar', testName: 'Complete Blood Count', orderedBy: 'Dr. Priya Sharma', date: '2024-01-15', status: 'Completed', result: 'Normal' },
  { id: 'LT002', patientId: 'P003', patientName: 'Arun Verma', testName: 'MRI Brain', orderedBy: 'Dr. Ramesh Rao', date: '2024-01-15', status: 'In Progress' },
  { id: 'LT003', patientId: 'P002', patientName: 'Sunita Devi', testName: 'Ultrasound Abdomen', orderedBy: 'Dr. Meena Gupta', date: '2024-01-14', status: 'Completed', result: 'Normal Pregnancy' },
  { id: 'LT004', patientId: 'P006', patientName: 'Kavita Sharma', testName: 'Audiometry', orderedBy: 'Dr. Vikram Joshi', date: '2024-01-15', status: 'Pending' },
  { id: 'LT005', patientId: 'P007', patientName: 'Deepak Singh', testName: 'Chest X-Ray', orderedBy: 'Dr. Sanjay Patel', date: '2024-01-13', status: 'Completed', result: 'Mild Consolidation' },
  { id: 'LT006', patientId: 'P008', patientName: 'Asha Reddy', testName: 'HbA1c', orderedBy: 'Dr. Lakshmi Rao', date: '2024-01-15', status: 'Pending' },
];

export const prescriptions: Prescription[] = [
  {
    id: 'RX001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001', doctorName: 'Dr. Priya Sharma', date: '2024-01-15',
    diagnosis: 'Hypertension with mild Angina',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 Tab', frequency: 'Once Daily', duration: '30 Days', quantity: 30 },
      { name: 'Aspirin 75mg', dosage: '1 Tab', frequency: 'Once Daily', duration: '30 Days', quantity: 30 },
      { name: 'Atorvastatin 20mg', dosage: '1 Tab', frequency: 'At Night', duration: '30 Days', quantity: 30 },
    ],
    notes: 'Take with meals',
    status: 'Active'
  },
  {
    id: 'RX002', patientId: 'P003', patientName: 'Arun Verma', doctorId: 'D003', doctorName: 'Dr. Suresh Mehta', date: '2024-01-10',
    diagnosis: 'Fracture Left Femur Post ORIF',
    medicines: [
      { name: 'Tramadol 50mg', dosage: '1 Tab', frequency: 'Twice Daily', duration: '7 Days', quantity: 14 },
      { name: 'Calcium + Vit D3', dosage: '1 Tab', frequency: 'Once Daily', duration: '60 Days', quantity: 60 },
    ],
    notes: 'Post-operative pain management',
    status: 'Active'
  },
];

export const departmentStats = [
  { name: 'Cardiology', patients: 24, revenue: 180000, color: '#0c8ee8' },
  { name: 'Orthopedics', patients: 18, revenue: 240000, color: '#6c5ce7' },
  { name: 'Neurology', patients: 15, revenue: 210000, color: '#00b894' },
  { name: 'Gynecology', patients: 22, revenue: 150000, color: '#fd79a8' },
  { name: 'Radiology', patients: 45, revenue: 120000, color: '#fdcb6e' },
  { name: 'Pharmacy', patients: 120, revenue: 90000, color: '#00cec9' },
];

export const revenueData = [
  { month: 'Aug', revenue: 380000, expenses: 280000 },
  { month: 'Sep', revenue: 420000, expenses: 300000 },
  { month: 'Oct', revenue: 390000, expenses: 290000 },
  { month: 'Nov', revenue: 450000, expenses: 320000 },
  { month: 'Dec', revenue: 480000, expenses: 340000 },
  { month: 'Jan', revenue: 510000, expenses: 360000 },
];

export const opdData = [
  { day: 'Mon', opd: 45, ipd: 12 },
  { day: 'Tue', opd: 52, ipd: 15 },
  { day: 'Wed', opd: 38, ipd: 10 },
  { day: 'Thu', opd: 61, ipd: 18 },
  { day: 'Fri', opd: 55, ipd: 14 },
  { day: 'Sat', opd: 42, ipd: 8 },
  { day: 'Sun', opd: 30, ipd: 6 },
];
