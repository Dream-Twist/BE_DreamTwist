/**
File Name : configuration.ts
Description : config
Author : 강민규

History
Date        Author   Status    Description
2024.07.19  강민규   Created
2024.07.19  박수정   Modified  based on https://docs.nestjs.com/techniques/configuration
*/

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    }
  });