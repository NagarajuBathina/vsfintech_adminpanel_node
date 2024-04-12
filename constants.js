//formated date
function formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate().toString().padStart(2, '0'); 
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    let year = date.getFullYear(); 
    let formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}

module.exports = {formatTimestamp};