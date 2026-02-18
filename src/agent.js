import OpenAI from 'openai';
import { runQuery } from './db.js';
import { loadSchema } from './schema.js';
import config from '../config.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askQuestion(userQuestion) {
  const schema = await loadSchema();

  const sql = await generateSQL(userQuestion, schema);

  let queryResult;
  try {
    queryResult = await runQuery(sql);
  } catch (err) {
    throw new Error(`SQL execution failed: ${err.message}\n  SQL was: ${sql}`);
  }

  const answer = await generateAnswer(userQuestion, sql, queryResult);
  return answer;
}

async function generateSQL(question, schema) {
  const systemPrompt = buildSQLSystemPrompt(schema);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ];

  if (schema.imageBase64) {
    const mimeType = schema.imageMimeType || 'image/png';
    messages[1] = {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${schema.imageBase64}`,
          },
        },
        { type: 'text', text: question },
      ],
    };
  }

  const response = await openai.chat.completions.create({
    model: config.model,
    messages,
    temperature: 0,
  });

  const raw = response.choices[0].message.content.trim();

  const match = raw.match(/```(?:sql)?\s*([\s\S]*?)```/i);
  return match ? match[1].trim() : raw;
}

async function generateAnswer(question, sql, queryResult) {
  const resultSummary =
    queryResult.length === 0
      ? 'The query returned no rows.'
      : JSON.stringify(queryResult, null, 2);

  const response = await openai.chat.completions.create({
    model: config.model,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. The user asked a question about a database. ' +
          'You have been given the SQL query that was run and the results. ' +
          'Provide a clear, concise, natural language answer to the user\'s original question. ' +
          'Do not mention SQL or technical details unless the user asked for them.',
      },
      {
        role: 'user',
        content:
          `Original question: ${question}\n\n` +
          `SQL used: ${sql}\n\n` +
          `Query results:\n${resultSummary}`,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

function buildSQLSystemPrompt(schema) {
  let prompt =
    `You are an expert SQL assistant. Your job is to convert natural language questions into valid MySQL SQL queries.\n\n` +
    `Rules:\n` +
    `- Return ONLY the SQL query, no explanation.\n` +
    `- Do not use markdown unless wrapping the SQL in a code block.\n` +
    `- Use proper MySQL syntax.\n` +
    `- Never use DROP, DELETE, UPDATE, INSERT, or any destructive statements.\n` +
    `- If the question cannot be answered with SQL, return: SELECT 'Cannot answer this question with SQL' AS message;\n\n`;

  if (schema.sql) {
    prompt += `Database schema:\n\`\`\`sql\n${schema.sql}\n\`\`\`\n`;
  }

  if (schema.imageBase64) {
    prompt += `\nA schema diagram is also provided as an image.\n`;
  }

  return prompt;
}