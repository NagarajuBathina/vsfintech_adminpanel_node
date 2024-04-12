const pool = require('../db')


function toggleCouponActivation(status) {
    return new Promise((resolve, reject) => {
        // Convert the boolean status to a number since MySQL does not have a native boolean type.
        const activationStatus = status ? 1 : 0;

        pool.getConnection((error, connection) => {
            if (error) {
                return reject(error); 
            }

            const sql = 'UPDATE `coupon_code` SET `status` = ? WHERE `coupon_code` = "ABC10EF5"';
            connection.query(sql, [activationStatus], (error, results) => {
                connection.release(); // Release the connection back to the pool.
                if (error) {
                    return reject(error); // If query fails, reject the promise.
                }
                resolve(results); // Resolve the promise with the query results.
            });
        });
    });
}

module.exports = {
    toggleCouponActivation
};