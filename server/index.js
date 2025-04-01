import dotenv from 'dotenv'
import { dbConnection } from './src/connections/dbConnection.js'

import { app } from './app.js'
import {redis} from './src/connections/redisConnection.js'
dotenv.config({

    path:'./.env'
})

const PORT=process.env.PORT || 8001

dbConnection()
    .then(() => {
        return new Promise((resolve, reject) => {
            redis.ping((err, result) => {
                if (err) {
                    console.error("Redis Connection Error:", err);
                    reject(err);
                } else {
                    console.log("Redis Ping Response:", result);
                    resolve();
                }
            });
        });
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`SERVER STARTED AT PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("SERVER STARTUP ERROR:", error);
    });