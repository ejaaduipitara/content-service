CREATE TYPE statusEnum AS ENUM('Draft','Live','Retired');
CREATE TYPE languageEnum AS ENUM('English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu', 'Urdu', 'Sanskrit');
CREATE TABLE djp_contents (
  identifier        VARCHAR(255) NOT NULL UNIQUE,
  name             VARCHAR(255),
  thumbnail        VARCHAR(500),
  description      TEXT,
  mimeType         VARCHAR(255),
  url              VARCHAR(255),
  media            JSONB,
  agegroup         VARCHAR(255),
  domain           VARCHAR(255),
  curriculargoal   VARCHAR(500),
  competencies     TEXT[],
  language         languageEnum,
  category         VARCHAR(500),
  sourceorg        VARCHAR(500),
  audience          TEXT[],
  keywords         TEXT[],
  status           statusEnum,
  learningoutcomes VARCHAR(500),
  createdon        TIMESTAMP,
  lastupdatedon    TIMESTAMP
);
