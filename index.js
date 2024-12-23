const noblox = require("noblox.js");
const config = require("./config.json");

const groupId = 6531843;

async function startApp() {
    try {
        // Log in using the .ROBLOSECURITY cookie
        const currentUser = await noblox.setCookie(config.cookie);
        console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`);

        // Main loop
        while (true) {
            const robux = await noblox.getGroupFunds(groupId);
            console.log(`Current Robux: ${robux}`);

            // Check payout conditions
            if (robux >= config.minimum_robux) {
                if (robux < config.maximum_robux) {
                    console.log("Waiting for more Robux...");
                } else {
                    console.log("Giving out Robux...");
                    await noblox.groupPayout(groupId, currentUser.UserID, robux);
                    console.log(`Paid ${robux} Robux to ${currentUser.UserName}!`);
                }
            } else {
                console.log(`You don't have enough Robux. Waiting ${config.wait_time} seconds...`);
            }

            // Wait before the next iteration
            await new Promise(resolve => setTimeout(resolve, config.wait_time * 1000));
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

startApp();
