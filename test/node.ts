import './all';
import { Typtap } from 'test';

(async () => {
    const { passed, failed } = await Typtap.Default.run();
    process.exitCode = failed;
})();
