# Natural Language SQL REPL

Ask your MySQL database questions in plain English. Powered by OpenAI.

---

## How it works

```
  1. User asks a question
  2. chatGPT generates SQL using your schema
  3. MySQL runs the query
  4. chatGPT explains the results as a plain English answer
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set your OpenAI API key

```bash
export OPENAI_API_KEY=sk-...
```

### 3. Configure your database

Edit **`config.js`**:

```js
model: 'gpt-5.2',
dbConnectionString: 'mysql://root:password@localhost:3306/my_database',
schemaSQLPath:  './schema.sql',   // your CREATE TABLE statements
schemaImagePath: './schema.png',  // your ERD diagram (or null to skip)
```

### 4. Add your schema

**Option A — SQL file** (`schema.sql`):
Replace the example file with your own `CREATE TABLE` statements.

**Option B — Schema image** (`schema.png`):
Add your ERD diagram to the project.

**Using both** is recommended.

---

## Run

```bash
npm start
```

---
