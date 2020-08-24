import 'dotenv/config';

import { app } from './app';
import { appConfig } from './config/app';

app.listen(appConfig.PORT, () => {
  console.log(`Server Running on Port ${appConfig.PORT}`)
});
