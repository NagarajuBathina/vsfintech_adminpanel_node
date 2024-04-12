const fs = require('fs');
const csv = require('fast-csv');
const pool = require('../db')


const formattedDateFunction = require('../constants');

//broad function
function uploadBroad(path,fileName, callback) {
    let stream = fs.createReadStream(path);
    let csvData = []; 
    let headers = []; 
    let fileStream = csv.parse().on('data', function (data) {
        csvData.push(data); 
    }).on('end', function () {
        const headerRow = csvData.shift(); 
        headers = headerRow.slice(1).map(header => header.trim()); 
        
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
            } else {
                // Fetch column names from the database table
                connection.query('SHOW COLUMNS FROM broadheatmap', (columnError, columnResult) => {
                    if (columnError) {
                        console.error('Error fetching column names', columnError);
                        connection.release();
                        return callback(columnError);
                    }

                    const dbColumnNames = columnResult.map(column => column.Field); 

                    // Iterate through each header in the CSV file
                    headers.forEach(header => {
                        if (dbColumnNames.includes(header)) {
                            const index = headers.indexOf(header);
                            csvData.forEach(row => {
                                let valueToUpdate = row[index + 1];
                                const commonColumnName = row[0];
                                let date = Date.now();
                                let formattedDate = formattedDateFunction.formatTimestamp(date); 
                                let name = 'Broad';
                                let fileData=[name,formattedDate,fileName]
            
                                let fileQuery = 'INSERT INTO file_data (category, dates, file_name) VALUES (?)';

                                // Fetch the current value of the column from the database
                                connection.query(`SELECT ?? FROM broadheatmap WHERE ${dbColumnNames[0]} = ?`, [header, commonColumnName], (selectError, selectResult) => {
                                    if (selectError) {
                                        console.error('Error fetching previous value', selectError);
                                    } else {
                                        let previousValue;
                                        if(selectResult[0]){
                                            previousValue = selectResult[0][header] || '';
                                        }
                                        console.log('PPPPrevious value',previousValue);

                                        // const average = (parseFloat(valueToUpdate)+previousValue)/2;
                                        
                                        // Update the column with the new value
                                        const query = `UPDATE broadheatmap SET ?? = ? WHERE ${dbColumnNames[0]} = ?`; 
                                        connection.query(query, [header, valueToUpdate, commonColumnName], (updateError, updateResult) => {
                                            if (updateError) {
                                                console.error('Error updating row', updateError);
                                            } else {
                                                console.log(' updated successfully');
                                                
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
                        }
                    });
                    connection.release();
                    return callback(null);
                });
            }
        });
    });
    stream.pipe(fileStream);
}





//strategy function
function uploadStrategy(path,fileName, callback) {
    let stream = fs.createReadStream(path);
    let csvData = [];
    let headers = []; 
    let fileStream = csv.parse().on('data', function (data) {
        csvData.push(data); 
    }).on('end', function () {
        const headerRow = csvData.shift(); 
        headers = headerRow.slice(1).map(header => header.trim()); 
        
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
            } else {
                // Fetch column names from the database table
                connection.query('SHOW COLUMNS FROM strategyheatmap', (columnError, columnResult) => {
                    if (columnError) {
                        console.error('Error fetching column names', columnError);
                        connection.release();
                        return callback(columnError);
                    }

                    const dbColumnNames = columnResult.map(column => column.Field); 

                    // Iterate through each header in the CSV file
                    headers.forEach(header => {
                        if (dbColumnNames.includes(header)) {
                            const index = headers.indexOf(header);
                            csvData.forEach(row => {
                                let valueToUpdate = row[index + 1];
                                console.log('csv data', valueToUpdate);

                                const commonColumnName = row[0];
                                console.log('col names of the csv file', commonColumnName);

                                let date = Date.now();
                                let formattedDate = formattedDateFunction.formatTimestamp(date); 
                                let name = 'Strategy';
                                let fileData=[name,formattedDate,fileName]
            
                                let fileQuery = 'INSERT INTO file_data (category, dates, file_name) VALUES (?)';

                                // Fetch the current value of the column from the database
                                connection.query(`SELECT ?? FROM strategyheatmap WHERE ${dbColumnNames[0]} = ?`, [header, commonColumnName], (selectError, selectResult) => {
                                    if (selectError) {
                                        console.error('Error fetching previous value', selectError);
                                    } else {
                                        // Calculate the new value by adding the previous value and valueToUpdate
                                        let previousValue;
                                        if(selectResult[0]){
                                            previousValue = selectResult[0][header] || ''; 
                                        }
                    
                                        // const average = (parseFloat(valueToUpdate)+previousValue)/2;

                                        // Update the column with the new value
                                        const query = `UPDATE strategyheatmap SET ?? = ? WHERE ${dbColumnNames[0]} = ?`; 
                                        connection.query(query, [header, valueToUpdate, commonColumnName], (updateError, updateResult) => {
                                            if (updateError) {
                                                console.error('Error updating row', updateError);
                                            } else {
                                                console.log(' updated successfully');
                                                
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
                        }
                    });
                    connection.release();
                    return callback(null);
                });
            }
        });
    });
    stream.pipe(fileStream);
}





//thematic function
function uploadThematic(path,fileName, callback) {
    let stream = fs.createReadStream(path);
    let csvData = [];
    let headers = []; 
    let fileStream = csv.parse().on('data', function (data) {
        csvData.push(data); 
    }).on('end', function () {
        const headerRow = csvData.shift(); 
        headers = headerRow.slice(1).map(header => header.trim()); 
        console.log(`**********${headers}`);
        
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
            } else {
                // Fetch column names from the database table
                connection.query('SHOW COLUMNS FROM thematicheatmap', (columnError, columnResult) => {
                    if (columnError) {
                        console.error('Error fetching column names', columnError);
                        connection.release();
                        return callback(columnError);
                    }

                    const dbColumnNames = columnResult.map(column => column.Field); 

                    // Iterate through each header in the CSV file
                    headers.forEach(header => {
                        if (dbColumnNames.includes(header)) {
                            const index = headers.indexOf(header);
                            csvData.forEach(row => {
                                let valueToUpdate = row[index + 1];
                                console.log('csv data', valueToUpdate);

                                const commonColumnName = row[0];
                                console.log('col names of the csv file', commonColumnName);

                                let date = Date.now();
                                let formattedDate = formattedDateFunction.formatTimestamp(date); 
                                let name = 'Thematic';
                                let fileData=[name,formattedDate,fileName]
            
                                let fileQuery = 'INSERT INTO file_data (category, dates, file_name) VALUES (?)';

                                // Fetch the current value of the column from the database
                                connection.query(`SELECT ?? FROM thematicheatmap WHERE ${dbColumnNames[0]} = ?`, [header, commonColumnName], (selectError, selectResult) => {
                                    if (selectError) {
                                        console.error('Error fetching previous value', selectError);
                                    } else {
                                       
                                        let previousValue;
                                        if(selectResult[0]){
                                            previousValue = selectResult[0][header] || '';
                                        }
                                        console.log('PPPPrevious value',previousValue);

                                    
                                        // const average = (parseFloat(valueToUpdate)+previousValue)/2;

                                        

                                        // Update the column with the new value
                                        const query = `UPDATE thematicheatmap SET ?? = ? WHERE ${dbColumnNames[0]} = ?`; 
                                        connection.query(query, [header, valueToUpdate, commonColumnName], (updateError, updateResult) => {
                                            if (updateError) {
                                                console.error('Error updating row', updateError);
                                            } else {
                                                console.log(' updated successfully');

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
                        }
                    });
                    connection.release();
                    return callback(null);
                });
            }
        });
    });
    stream.pipe(fileStream);
}





//sector function
function uploadSector(path,fileName, callback) {
    let stream = fs.createReadStream(path);
    let csvData = [];
    let headers = []; 
    let fileStream = csv.parse().on('data', function (data) {
        csvData.push(data); 
    }).on('end', function () {
        const headerRow = csvData.shift(); 
        headers = headerRow.slice(1).map(header => header.trim()); 
        
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
            } else {
                // Fetch column names from the database table
                connection.query('SHOW COLUMNS FROM sectorheatmap', (columnError, columnResult) => {
                    if (columnError) {
                        console.error('Error fetching column names', columnError);
                        connection.release();
                        return callback(columnError);
                    }

                    const dbColumnNames = columnResult.map(column => column.Field); 

                    // Iterate through each header in the CSV file
                    headers.forEach(header => {
                        if (dbColumnNames.includes(header)) {
                            const index = headers.indexOf(header);
                            csvData.forEach(row => {
                                let valueToUpdate = row[index + 1];
                                console.log('csv data', valueToUpdate);

                                const commonColumnName = row[0];
                                console.log('col names of the csv file', commonColumnName);

                                let date = Date.now();
                                let formattedDate = formattedDateFunction.formatTimestamp(date); 
                                let name = 'Sector';
                                let fileData=[name,formattedDate,fileName]
            
                                let fileQuery = 'INSERT INTO file_data (category, dates, file_name) VALUES (?)';

                                // Fetch the current value of the column from the database
                                connection.query(`SELECT ?? FROM sectorheatmap WHERE ${dbColumnNames[0]} = ?`, [header, commonColumnName], (selectError, selectResult) => {
                                    if (selectError) {
                                        console.error('Error fetching previous value', selectError);
                                    } else {
                                        // Calculate the new value by adding the previous value and valueToUpdate
                                        let previousValue;
                                        if(selectResult[0]){
                                            previousValue = selectResult[0][header] || ''; // Set previousValue to the fetched value or 0 if undefined
                                        }
                                        console.log('PPPPrevious value',previousValue);

                                        // const average = (parseFloat(valueToUpdate)+previousValue)/2;

                                        // Update the column with the new value
                                        const query = `UPDATE sectorheatmap SET ?? = ? WHERE ${dbColumnNames[0]} = ?`; 
                                        connection.query(query, [header, valueToUpdate, commonColumnName], (updateError, updateResult) => {
                                            if (updateError) {
                                                console.error('Error updating row', updateError);
                                            } else {
                                                console.log(' updated successfully');
                                                
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
                        }
                    });
                    connection.release();
                    return callback(null);
                });
            }
        });
    });
    stream.pipe(fileStream);
}


module.exports = {uploadBroad,uploadSector,uploadStrategy,uploadThematic}