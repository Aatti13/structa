import { v4 } from "uuid";
import { getDB } from "../db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


const db = getDB();

export default {
  async create({username, email, passwordHash, avatarURL = '', bio = ''}) {
    const doc = {
      _id: v4(),
      type: 'user',
      username, 
      email,
      passwordHash,
      avatarURL,
      bio,
      createdAt: new Date().toString(),
    };
    await db.insert(doc);
    return doc;
  },

  async updateProfile(id, updates) {
    const existing = await db.get(id);
    const updated = {...existing, ...updates};

    await db.insert(updated);
    return updated;
  },

  async findByEmail(email) {
    const result = await db.find({
      selector: {type: 'user', email},
      limit: 1,
    });
    return result.docs[0];
  },

  async findByUsername(username) {
    const result = await db.find({
      selector: {type: 'user', username},
      limit: 1,
    });
    return result.docs[0];
  },

  async get(id) {
    return await db.get(id);
  },
};