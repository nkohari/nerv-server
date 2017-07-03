import Forge from 'forge-di';
import Application from './Application';

interface Environment {
  setup(app: Application): Forge;
}

export default Environment;
