
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  tags TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  address TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  contact TEXT,
  value REAL DEFAULT 0,
  status TEXT CHECK(status IN ('Neu','In Arbeit','Gewonnen','Verloren')) NOT NULL DEFAULT 'Neu',
  next TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('Anruf','E-Mail','Meeting','Notiz')) NOT NULL DEFAULT 'Notiz',
  subject TEXT NOT NULL,
  ref TEXT,
  due TEXT,
  done INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
