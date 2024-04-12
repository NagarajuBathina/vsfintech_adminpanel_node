const pool = require('../db');
const fs = require('fs');

function uploadBlogData(file, content) {
    if (!file || !content) {
        return Promise.reject(new Error('Image and Content are mandatory'));
    }

    const imageData = fs.readFileSync(file.path);
    console.log(imageData);
    const query = 'INSERT INTO blog(image, content) VALUES (?, ?)';
    const values = [imageData, content];

    return new Promise((resolve, reject) => {
        pool.query(query, values, function (err, result) {
            if (err) {
                console.error('Error inserting blog data:', err);
                reject(err);
            } else {
                console.log('Data inserted successfully');
                resolve(result);
            }
        });
    });
}

module.exports = { uploadBlogData };
