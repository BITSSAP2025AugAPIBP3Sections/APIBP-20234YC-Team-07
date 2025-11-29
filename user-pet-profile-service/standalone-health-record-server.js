// standalone-health-record-server.js
// Standalone Node application exposing health-record GraphQL API

require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');

const app = express();

// Configuration
const PORT = 3009;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pet-profile-service';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// File-based storage (simulate DB with JSON files)
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PETS_FILE = path.join(DATA_DIR, 'pets.json');

// Helper ID generator
function genId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try { await fs.access(USERS_FILE); } catch { await fs.writeFile(USERS_FILE, '[]'); }
    try { await fs.access(PETS_FILE); } catch { await fs.writeFile(PETS_FILE, '[]'); }
  } catch (err) {
    console.error('Error ensuring data files:', err);
    process.exit(1);
  }
}

async function readJson(file) {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeJson(file, obj) {
  await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
}

async function loadUsers() { await ensureDataFiles(); return readJson(USERS_FILE); }
async function saveUsers(users) { await ensureDataFiles(); return writeJson(USERS_FILE, users); }
async function loadPets() { await ensureDataFiles(); return readJson(PETS_FILE); }
async function savePets(pets) { await ensureDataFiles(); return writeJson(PETS_FILE, pets); }

// Seed sample data if empty
async function seedIfEmpty() {
  const users = await loadUsers();
  const pets = await loadPets();
  let changed = false;
  if (users.length === 0) {
    users.push({ id: 'admin1', name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' });
    users.push({ id: 'user1', name: 'Alice', email: 'alice@example.com', password: 'password', role: 'user' });
    changed = true;
  }
  if (pets.length === 0) {
    pets.push({ id: 'pet1', user: 'user1', name: 'Rex', species: 'dog', age: 4, breed: 'labrador', medicalHistory: [] });
    changed = true;
  }
  if (changed) {
    await saveUsers(users);
    await savePets(pets);
    console.log('Seeded sample users and pets in', DATA_DIR);
  }
}

// GraphQL schema
const schema = buildSchema(`
  type HealthRecord {
    _id: ID!
    description: String
    vet: String
    vaccine: String
    dateAdministered: String
    nextDueDate: String
  }

  input HealthRecordInput {
    description: String
    vet: String
    vaccine: String
    dateAdministered: String
    nextDueDate: String
  }

  type HealthRecordResponse {
    message: String
    healthRecord: HealthRecord
  }

  type DeleteResponse {
    message: String
  }

  type Query {
    getHealthRecords(petId: ID!): [HealthRecord!]!
    getHealthRecord(petId: ID!, recordId: ID!): HealthRecord
  }

  type Mutation {
    addHealthRecord(petId: ID!, input: HealthRecordInput!): HealthRecordResponse
    updateHealthRecord(petId: ID!, recordId: ID!, input: HealthRecordInput!): HealthRecordResponse
    deleteHealthRecord(petId: ID!, recordId: ID!): DeleteResponse
  }
`);

// Helper: extract user from Authorization header and load from file-based users
async function getUserFromReq(headers) {
  const authHeader = headers.authorization || headers.Authorization || '';
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) return null;
    const users = await loadUsers();
    const user = users.find((u) => u.id === decoded.userId || u._id === decoded.userId);
    return user || null;
  } catch (err) {
    return null;
  }
}

// Helper: find pet by id and enforce access (admin can access all)
async function findPetWithAccess(petId, user) {
  const pets = await loadPets();
  const pet = pets.find((p) => p.id === petId || p._id === petId);
  if (!pet) return null;
  if (user.role === 'admin') return pet;
  return pet.user === user.id ? pet : null;
}

// Root resolvers factory to capture request headers
function createRoot(headers) {
  return {
    getHealthRecords: async ({ petId }) => {
      const user = await getUserFromReq(headers);
      if (!user) throw new Error('Unauthorized: missing or invalid token');

      const pet = await findPetWithAccess(petId, user);
      if (!pet) throw new Error('Pet not found or access denied');

      return (pet.medicalHistory || []).map((r) => ({
        _id: r.id || r._id || String(r._id || genId('r')),
        description: r.description || null,
        vet: r.vet || null,
        vaccine: r.vaccine || null,
        dateAdministered: r.dateAdministered ? new Date(r.dateAdministered).toISOString() : null,
        nextDueDate: r.nextDueDate ? new Date(r.nextDueDate).toISOString() : null,
      }));
    },

    getHealthRecord: async ({ petId, recordId }) => {
      const user = await getUserFromReq(headers);
      if (!user) throw new Error('Unauthorized: missing or invalid token');

      const pet = await findPetWithAccess(petId, user);
      if (!pet) throw new Error('Pet not found or access denied');

      const r = (pet.medicalHistory || []).find((rec) => (rec.id || rec._id) == recordId);
      if (!r) throw new Error('Health record not found');

      return {
        _id: r.id || r._id,
        description: r.description || null,
        vet: r.vet || null,
        vaccine: r.vaccine || null,
        dateAdministered: r.dateAdministered ? new Date(r.dateAdministered).toISOString() : null,
        nextDueDate: r.nextDueDate ? new Date(r.nextDueDate).toISOString() : null,
      };
    },

    addHealthRecord: async ({ petId, input }) => {
      const user = await getUserFromReq(headers);
      if (!user) throw new Error('Unauthorized: missing or invalid token');

      const pets = await loadPets();
      const petIndex = pets.findIndex((p) => (p.id === petId || p._id === petId));
      if (petIndex === -1) throw new Error('Pet not found');
      const pet = pets[petIndex];
      if (user.role !== 'admin' && pet.user !== user.id) throw new Error('Access denied');

      const rec = {
        id: genId('rec_'),
        description: input.description,
        vet: input.vet,
        vaccine: input.vaccine,
        dateAdministered: input.dateAdministered ? new Date(input.dateAdministered).toISOString() : null,
        nextDueDate: input.nextDueDate ? new Date(input.nextDueDate).toISOString() : null,
      };

      pet.medicalHistory = pet.medicalHistory || [];
      pet.medicalHistory.push(rec);
      pets[petIndex] = pet;
      await savePets(pets);

      return {
        message: 'Health record added successfully',
        healthRecord: {
          _id: rec.id,
          description: rec.description || null,
          vet: rec.vet || null,
          vaccine: rec.vaccine || null,
          dateAdministered: rec.dateAdministered || null,
          nextDueDate: rec.nextDueDate || null,
        },
      };
    },

    updateHealthRecord: async ({ petId, recordId, input }) => {
      const user = await getUserFromReq(headers);
      if (!user) throw new Error('Unauthorized: missing or invalid token');

      const pets = await loadPets();
      const petIndex = pets.findIndex((p) => (p.id === petId || p._id === petId));
      if (petIndex === -1) throw new Error('Pet not found');
      const pet = pets[petIndex];
      if (user.role !== 'admin' && pet.user !== user.id) throw new Error('Access denied');

      const recIndex = (pet.medicalHistory || []).findIndex((rec) => (rec.id || rec._id) == recordId);
      if (recIndex === -1) throw new Error('Health record not found');

      const r = pet.medicalHistory[recIndex];
      if (input.description !== undefined) r.description = input.description;
      if (input.vet !== undefined) r.vet = input.vet;
      if (input.vaccine !== undefined) r.vaccine = input.vaccine;
      if (input.dateAdministered !== undefined) r.dateAdministered = input.dateAdministered ? new Date(input.dateAdministered).toISOString() : null;
      if (input.nextDueDate !== undefined) r.nextDueDate = input.nextDueDate ? new Date(input.nextDueDate).toISOString() : null;

      pet.medicalHistory[recIndex] = r;
      pets[petIndex] = pet;
      await savePets(pets);

      return {
        message: 'Health record updated successfully',
        healthRecord: {
          _id: r.id || r._id,
          description: r.description || null,
          vet: r.vet || null,
          vaccine: r.vaccine || null,
          dateAdministered: r.dateAdministered || null,
          nextDueDate: r.nextDueDate || null,
        },
      };
    },

    deleteHealthRecord: async ({ petId, recordId }) => {
      const user = await getUserFromReq(headers);
      if (!user) throw new Error('Unauthorized: missing or invalid token');

      const pets = await loadPets();
      const petIndex = pets.findIndex((p) => (p.id === petId || p._id === petId));
      if (petIndex === -1) throw new Error('Pet not found');
      const pet = pets[petIndex];
      if (user.role !== 'admin' && pet.user !== user.id) throw new Error('Access denied');

      const recordIndex = (pet.medicalHistory || []).findIndex((record) => (record.id || record._id) == recordId);
      if (recordIndex === -1) throw new Error('Health record not found');

      pet.medicalHistory.splice(recordIndex, 1);
      pets[petIndex] = pet;
      await savePets(pets);

      return { message: 'Health record deleted successfully' };
    },
  };
}

// GraphQL endpoint mounted at /graphql-health-records
app.use('/graphql-health-records', (req, res) => {
  const root = createRoot(req.headers);
  return graphqlHTTP({ schema, rootValue: root, graphiql: true })(req, res);
});

// Seed data files (if empty) and start server
seedIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`Standalone HealthRecord GraphQL server running on http://localhost:${PORT}/graphql-health-records`);
    console.log('Use Authorization: Bearer <token> header to authenticate.');
    console.log('Seeded data directory:', DATA_DIR);
  });
}).catch((err) => {
  console.error('Failed to seed data or start server:', err);
  process.exit(1);
});
