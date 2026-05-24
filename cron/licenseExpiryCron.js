import cron from "node-cron";

cron.schedule("0 0 * * *", () => {
    console.log("License Expiry Check Running");
});