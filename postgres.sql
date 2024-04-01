CREATE TYPE statusEnum AS ENUM('Draft','Live','Retired');
CREATE TYPE languageEnum AS ENUM('English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu', 'Urdu', 'Sanskrit');
CREATE TABLE djp_contents (
  identifier        VARCHAR(255) NOT NULL UNIQUE,
  name             VARCHAR(500),
  thumbnail        VARCHAR(1000),
  description      TEXT,
  mimetype         TEXT,
  url              VARCHAR(255),
  media            JSONB,
  agegroup         TEXT,
  domain           VARCHAR(255),
  curriculargoal   TEXT,
  competencies     TEXT[],
  language         languageEnum,
  category         VARCHAR(1000),
  sourceorg        VARCHAR(1000),
  audience          TEXT[],
  keywords         TEXT[],
  status           statusEnum,
  learningoutcomes TEXT,
  createdon        TIMESTAMP,
  lastupdatedon    TIMESTAMP
);

ALTER TYPE languageEnum ADD VALUE 'Khasi';
