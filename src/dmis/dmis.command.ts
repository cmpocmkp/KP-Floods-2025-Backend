import { Command, CommandRunner } from 'nest-commander';
import { DmisCronService } from './dmis-cron.service';

@Command({ name: 'fetch-dmis', description: 'Fetch DMIS data manually' })
export class DmisCommand extends CommandRunner {
  constructor(private readonly dmisCronService: DmisCronService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    console.log('Starting manual DMIS data fetch...');
    await this.dmisCronService.handleCron();
    console.log('Completed DMIS data fetch');
  }
}