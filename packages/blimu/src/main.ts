import { Command } from 'commander';
import { codegenCommand } from './commands/codegen';

const program = new Command();

program
  .name('blimu')
  .description('Blimu - Authorization as a Service CLI')
  .version(process.env.npm_package_version || '0.7.0');

// Register commands
codegenCommand(program);

// Parse arguments
program.parse();
