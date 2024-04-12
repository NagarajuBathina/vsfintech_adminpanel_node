const fs = require('fs');
const csv = require('fast-csv');
const pool = require('../db');

const formattedDateFunction = require('../constants');



// all indices data function
function uploadAllData(path,fileName, callback) {
    let stream = fs.createReadStream(path);
    let csvData = [];
    let fileStream = csv.parse().on('data', function (data) {
        csvData.push(data);
    }).on('end', function () {
        csvData.shift();
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
                if(error.code === 'ETIMEDOUT'){
                    setTimeout(() => {
                        uploadAllData(path, fileName, callback);
                    }, 5000); // Retry after 5 seconds
                    return;
                } else {
                    // Handle other errors
                    callback(error);
                    return;
                }
            } else {
                let date = Date.now();
                let formattedDate = formattedDateFunction.formatTimestamp(date); 
                let name = 'Stock & Heat';
                let fileData=[name,formattedDate,fileName]

                    let query = "INSERT INTO heat_map_data VALUES ?";
                    let fileQuery = 'INSERT INTO file_data (category, dates, file_name) VALUES (?)';


                    connection.query(query, [csvData], (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error uploading new data', insertError);
                            connection.release();
                            return callback(insertError);
                        } else {
                            console.log('Data uploaded successfully');
                            console.log(csvData)

                            connection.query(fileQuery, [fileData], (fileInsertError, fileInsertResult) => {
                                if (fileInsertError) {
                                    console.error('Error uploading file data', fileInsertError);
                                    connection.release();
                                    return callback(fileInsertError);
                                } else {
                                    console.log('File data uploaded successfully');
                                    connection.release();
                                    return callback(null);
                                }
                            });
                        }
                    });
            }
        });
    });
    stream.pipe(fileStream);
}



module.exports = {
    uploadAllData:uploadAllData
};