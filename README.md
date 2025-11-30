# Team 07
Routes:
gql:  /graphql-health-records
swaggerdocs: /api-docs

# Veterinary Health & Care Management Platform

### Table of Contents

1. [Team Members](#team-members)
2. [Project Summary](#project-summary)
3. [API Modules Overview](#api-modules-overview)

---

## Team Members

| Name      | Role | Contact                                                             |
| --------- | ---- | ------------------------------------------------------------------- |
| Pravalika | TBD  | [bachupravalika8833@gmail.com](mailto:bachupravalika8833@gmail.com) |
| Prerana   | TBD  | [maktalprerana13@gmail.com](mailto:maktalprerana13@gmail.com)       |
| Karan     | TBD  | [karan.banjade@gmail.com](mailto:karan.banjade@gmail.com)           |

---

## Project Summary

The **Veterinary Health & Care Management Platform** is a service-oriented system built to streamline the management of pets’ health and wellness. It provides dedicated modules for maintaining pet and owner profiles, recording medical history, managing appointments, and offering virtual consultation support. The architecture emphasizes modularity, scalability, and secure interactions between various microservices, ensuring an efficient and user-friendly experience for both pet owners and veterinary professionals.

**Core Functionalities:**

* Centralized Pet and Owner Information Management
* Secure Health Record Storage and Retrieval
* Appointment Booking and Automated Notifications
* Medication Schedules and Dosage Tracking
* Activity and Nutrition Monitoring
* Virtual Vet Consultations and Follow-ups
* Emergency Support and Service Finder
* Pet Care and Wellness Services

---

## API Modules Overview

### Functional Domains [Planned Features]:

1. **User & Pet Management Services**

   * Account Registration, Login, and Role Management
   * Profile Updates for Pet Owners and Vets
   * Pet Onboarding and Profile Handling
   * CRUD Operations for Medical and Vaccination Records

2. **Appointments & Medication Services**

   * Booking, Rescheduling, and Canceling Appointments
   * Automated Reminders for Appointments and Medications
   * Prescription Management

3. **Activity & Wellness Monitoring**

   * Daily Activity and Nutrition Logging
   * Analytics and Insights for Health Trends

4. **Consultation & Emergency Assistance**

   * Virtual Consultations and Chat Support
   * Pet Service Recommendations and Location Assistance
  
---

## Target Users

1. Pet Owners
2. Veterinarians (Vets)
3. Veterinary Clinics / Hospitals
4. Clinic Staff / Receptionists
5. Developers / Technical Team
6. Data Analysts
7. Third-Party API Providers

---

## GraphQL Highlights (Single Endpoint)

```graphql
# Core Types
type Pet {
  id: ID!
  name: String!
  species: String!        # e.g. Dog, Cat
  breed: String
  date_of_birth: String
  gender: String
  owner: Owner!
  medical_history: [MedicalRecord]
  appointments: [Appointment]
  activity_logs: [ActivityLog]
  nutrition_plan: NutritionPlan
}

type Owner {
  id: ID!
  name: String!
  email: String!
  phone: String
  address: String
  pets: [Pet]
}

type Vet {
  id: ID!
  name: String!
  email: String!
  specialization: String
  clinic_name: String
  phone: String
  consultations: [Consultation]
}

# Health Records
type MedicalRecord {
  id: ID!
  pet: Pet!
  visit_date: String!
  diagnosis: String
  notes: String
  prescribed_medications: [MedicationSchedule]
}

type MedicationSchedule {
  id: ID!
  pet: Pet!
  medication_name: String!
  dosage: String!          
  frequency: String!       
  start_date: String!
  end_date: String
  is_active: Boolean!
}

# Appointments & Consultations
type Appointment {
  id: ID!
  pet: Pet!
  owner: Owner!
  vet: Vet
  appointment_date: String!
  reason: String
  status: String!          
  is_virtual: Boolean!
}

type Consultation {
  id: ID!
  pet: Pet!
  owner: Owner!
  vet: Vet!
  consultation_date: String!
  mode: String!            
  notes: String
  follow_up_date: String
}

# Activity & Nutrition
type ActivityLog {
  id: ID!
  pet: Pet!
  date: String!
  activity_type: String!   
  duration_minutes: Int
  notes: String
}

type NutritionPlan {
  id: ID!
  pet: Pet!
  diet_type: String        
  daily_calories: Int
  feeding_schedule: String 
  notes: String
}

# Emergency & Services
type EmergencyService {
  id: ID!
  name: String!
  contact_number: String!
  address: String
  service_type: String     
}

type PetCareService {
  id: ID!
  name: String!
  description: String
  service_type: String     
  location: String
  contact_number: String
}

# Queries (examples)
type Query {
  pets: [Pet]
  petById(id: ID!): Pet

  owners: [Owner]
  ownerById(id: ID!): Owner

  vets: [Vet]
  vetById(id: ID!): Vet

  appointmentsByPet(petId: ID!): [Appointment]
  consultationsByPet(petId: ID!): [Consultation]

  emergencyServices: [EmergencyService]
  petCareServices(service_type: String): [PetCareService]
}

# Mutations (examples)
type Mutation {
  createPet(
    name: String!
    species: String!
    breed: String
    date_of_birth: String
    gender: String
    ownerId: ID!
  ): Pet!

  createOwner(
    name: String!
    email: String!
    phone: String
    address: String
  ): Owner!

  createAppointment(
    petId: ID!
    ownerId: ID!
    vetId: ID
    appointment_date: String!
    reason: String
    is_virtual: Boolean!
  ): Appointment!

  createMedicalRecord(
    petId: ID!
    visit_date: String!
    diagnosis: String
    notes: String
  ): MedicalRecord!

  createMedicationSchedule(
    petId: ID!
    medication_name: String!
    dosage: String!
    frequency: String!
    start_date: String!
    end_date: String
  ): MedicationSchedule!
}
```
