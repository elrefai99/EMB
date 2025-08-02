import Arena from "bull-arena";

export const arenaConfig: any = Arena(
     {
          BullMQ: require("bullmq").Queue,
          queues: [
               {
                    type: "bullmq",
                    name: "emailQ",
                    hostId: "server",
                    redis: {
                         url: process.env.REDIS_URL,
                    },
               },
          ],
     },
     {
          basePath: "/arena",
     }
);
