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

**Target Users**

1. Pet Owners
2. Veterinarians (Vets)
3. Veterinary Clinics / Hospitals
4. Clinic Staff / Receptionists
5. Developers / Technical Team
6. Data Analysts
7. Third-Party API Providers

---


## GraphQL Highlights (Single Endpoint)

# Core Types
{
  "entities": [
    {
      "name": "Pet",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        { "name": "name", "type": "String", "required": true },
        { "name": "species", "type": "String", "required": true },   // e.g. Dog, Cat
        { "name": "breed", "type": "String", "required": false },
        { "name": "date_of_birth", "type": "String", "required": false },
        { "name": "gender", "type": "String", "required": false },
        {
          "name": "owner",
          "type": "Owner",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Owner" }
        },
        {
          "name": "medical_history",
          "type": "MedicalRecord[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "MedicalRecord" }
        },
        {
          "name": "appointments",
          "type": "Appointment[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "Appointment" }
        },
       {
          "name": "activity_logs",
          "type": "ActivityLog[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "ActivityLog" }
        },
        {
          "name": "nutrition_plan",
          "type": "NutritionPlan",
          "required": false,
          "relation": { "type": "hasOne", "target": "NutritionPlan" }
        }
      ]
    },

    {
      "name": "Owner",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        { "name": "name", "type": "String", "required": true },
        { "name": "email", "type": "String", "required": true },
        { "name": "phone", "type": "String", "required": false },
        { "name": "address", "type": "String", "required": false },
        {
          "name": "pets",
          "type": "Pet[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "Pet" }
        }
      ]
    },

    {
      "name": "Vet",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        { "name": "name", "type": "String", "required": true },
        { "name": "email", "type": "String", "required": true },
        { "name": "specialization", "type": "String", "required": false },
        { "name": "clinic_name", "type": "String", "required": false },
        { "name": "phone", "type": "String", "required": false },
        {
          "name": "consultations",
          "type": "Consultation[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "Consultation" }
        }
      ]
    },

    {
      "name": "MedicalRecord",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        { "name": "visit_date", "type": "String", "required": true },
        { "name": "diagnosis", "type": "String", "required": false },
        { "name": "notes", "type": "String", "required": false },
        {
          "name": "prescribed_medications",
          "type": "MedicationSchedule[]",
          "required": false,
          "relation": { "type": "hasMany", "target": "MedicationSchedule" }
        }
      ]
    },

    {
      "name": "MedicationSchedule",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        { "name": "medication_name", "type": "String", "required": true },
        { "name": "dosage", "type": "String", "required": true },       // e.g. "5mg"
        { "name": "frequency", "type": "String", "required": true },    // e.g. "Twice a day"
        { "name": "start_date", "type": "String", "required": true },
        { "name": "end_date", "type": "String", "required": false },
        { "name": "is_active", "type": "Boolean", "required": true }
      ]
    },

    {
      "name": "Appointment",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        {
          "name": "owner",
          "type": "Owner",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Owner" }
        },
        {
          "name": "vet",
          "type": "Vet",
          "required": false,
          "relation": { "type": "belongsTo", "target": "Vet" }
        },
        { "name": "appointment_date", "type": "String", "required": true },
        { "name": "reason", "type": "String", "required": false },
        { "name": "status", "type": "String", "required": true },       // SCHEDULED, COMPLETED, etc.
        { "name": "is_virtual", "type": "Boolean", "required": true }
      ]
    },

    {
      "name": "Consultation",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        {
          "name": "owner",
          "type": "Owner",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Owner" }
        },
        {
          "name": "vet",
          "type": "Vet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Vet" }
        },
        { "name": "consultation_date", "type": "String", "required": true },
        { "name": "mode", "type": "String", "required": true },         // VIRTUAL / IN_PERSON
        { "name": "notes", "type": "String", "required": false },
        { "name": "follow_up_date", "type": "String", "required": false }
      ]
    },

    {
      "name": "ActivityLog",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        { "name": "date", "type": "String", "required": true },
        { "name": "activity_type", "type": "String", "required": true }, // WALK, PLAY, etc.
        { "name": "duration_minutes", "type": "Int", "required": false },
        { "name": "notes", "type": "String", "required": false }
      ]
    },

    {
      "name": "NutritionPlan",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        {
          "name": "pet",
          "type": "Pet",
          "required": true,
          "relation": { "type": "belongsTo", "target": "Pet" }
        },
        { "name": "diet_type", "type": "String", "required": false },
        { "name": "daily_calories", "type": "Int", "required": false },
        { "name": "feeding_schedule", "type": "String", "required": false },
        { "name": "notes", "type": "String", "required": false }
      ]
    },

    {
      "name": "EmergencyService",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        { "name": "name", "type": "String", "required": true },
        { "name": "contact_number", "type": "String", "required": true },
        { "name": "address", "type": "String", "required": false },
        { "name": "service_type", "type": "String", "required": true }  // 24x7 Clinic, Ambulance
      ]
    },

    {
      "name": "PetCareService",
      "fields": [
        { "name": "id", "type": "ID", "required": true, "primaryKey": true },
        { "name": "name", "type": "String", "required": true },
        { "name": "description", "type": "String", "required": false },
        { "name": "service_type", "type": "String", "required": true }, // GROOMING, BOARDING, etc.
        { "name": "location", "type": "String", "required": false },
        { "name": "contact_number", "type": "String", "required": false }
      ]
    }
  ]
}

---
