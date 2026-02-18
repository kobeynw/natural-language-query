import readline from 'readline';
import { askQuestion } from './src/agent.js';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question(chalk.cyan('\nAsk a question: '), async (input) => {
    const question = input.trim();

    if (!question) {
      prompt();
      return;
    }

    if (['exit', 'quit', 'q'].includes(question.toLowerCase())) {
      console.log(chalk.yellow('\nGoodbye!\n'));
      rl.close();
      process.exit(0);
    }

    try {
      console.log(chalk.dim('\nThinking...\n'));
      const answer = await askQuestion(question);
      console.log(chalk.green('Answer:'), answer);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
    }

    prompt();
  });
}

console.log(chalk.bold.blue('\n════════════════════════════════════'));
console.log(chalk.bold.white('   Natural Language Database REPL   '));
console.log(chalk.bold.blue('════════════════════════════════════'));
console.log(chalk.dim('  Type your question in plain English.'));
console.log(chalk.dim('  Type "exit" or "quit" to stop.\n'));

prompt();