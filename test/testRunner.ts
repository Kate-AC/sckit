import { testDivide } from './testStorage';
import { testCreateCreator, testGetAllCreator } from './testCreators';

(async () => {
  await testDivide();
  await testCreateCreator();
  await testGetAllCreator();
})();
