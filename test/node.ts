import { Typtap } from 'test';
import './all';

(async () => {
    const { passed, failed } = await Typtap.Default.run();
    process.exitCode = failed;
})();
