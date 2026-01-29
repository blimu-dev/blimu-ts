import { Command } from 'commander';
import { codegenCommand } from './commands/codegen';
import { pushCommand } from './commands/push';
import { loginCommand } from './commands/login';
import { logoutCommand } from './commands/logout';
import { whoamiCommand } from './commands/whoami';

const program = new Command();

program
  .name('blimu')
  .description('Blimu - Authorization as a Service CLI')
  .version(process.env['npm_package_version'] ?? '0.0.0');

// Register commands
codegenCommand(program);
pushCommand(program);
loginCommand(program);
logoutCommand(program);
whoamiCommand(program);

// Parse arguments
program.parse();
