const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { error } = require('console');
const cors = require('cors');
const pool = require('./db');
const app = express();
const comparisionController = require('./controllers/comparisionController');
const stock_heat_controller = require('./controllers/stock_heat_controller');
const month_week_controller = require('./controllers/month_week_controller');
const blog_controller = require('./controllers/blog_controller');
const coupon_controller = require('./controllers/coupon_code_controller');

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// multer config
let storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads/")
    },
    filename:(req,file,callback)=>{
        callback(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
})


let upload = multer({
    storage:storage
});



//blog POST request
app.post('/upload-blog',upload.single('file'),(req,res)=>{
    if(!req.file){
        return res.status(400).send('no file uploaded');
    }
    console.log('file uploaded',req.file);
    const content = req.body.content;
    console.log(content);
    console.log(req.file.fieldname);
    blog_controller.uploadBlogData(req.file,content).then(result=>{
        console.log('Blog data uploaded successfully:', result);
        res.status(200).send('Blog data uploaded successfully.');
    })
    .catch(error=>{
        console.error('Error uploading blog data:', error);
        res.status(500).send('Error uploading blog data.');
    })
})

// coupon code POST request
app.post('/handle-couponcode', (req, res) => {
    const status = req.body.status; 
    coupon_controller.toggleCouponActivation(status)
        .then(results => {
            res.status(200).json({ success: true, message: `Coupon code activation status updated successfully.${status}` });
        })
        .catch(error => {
            console.error('Error handling coupon code:', error);
            res.status(500).json({ success: false, message: 'Failed to update coupon code activation status.' });
        });
});


// broad POST request
app.post('/upload-broad', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
    comparisionController.uploadBroad(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});

//strategy POST request
app.post('/upload-strategy', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
    comparisionController.uploadStrategy(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});


//thematic POST request
app.post('/upload-thematic', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
    comparisionController.uploadThematic(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});

// sector POST request
app.post('/upload-sector', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
    comparisionController.uploadSector(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});



// all indices(stock & heat) data POST request
app.post('/upload-stock&heat-data', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
   stock_heat_controller.uploadAllData(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});


// prev-month and current-week POST request
app.post('/upload-month-week', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file);
    month_week_controller.uploadMonthAndWeek(__dirname + "/uploads/" + req.file.filename,req.file.originalname,(error)=>{
        if(error){
            return res.status(5000).json({error:'error uploading csv file'});
        }
        res.json({message:'file uploaded successfully'});
    }); 
});


//get all uploaded files data
app.get('/uploadedFiles-data',(req,res)=>{
    try{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log('Error getting database connection:', err);
                return res.status(500).json({error:'Internal Server Error'});
            }else{
                const query = 'SELECT * FROM file_data ORDER BY dates DESC';
                connection.query(query,(error,results)=>{
                    if(error){
                        console.log('Error executing the query',error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({results});
                })
            }
        })
    }catch(e){
        console.log('error getting files data',e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// get coupoun code status
app.get('/couponCode-status',(req,res)=>{
    try{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log('Error getting database connection:', err);
                return res.status(500).json({error:'Internal Server Error'});
            }else{
                const query = 'SELECT status FROM coupon_code';
                connection.query(query,(error,results)=>{
                    if(error){
                        console.log('Error executing the query',error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({results});
                })
            }
        })
    }catch(error){
        console.log('error getting files data',e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//get all subscribers data
app.get('/subscribers-data',(req,res)=>{
    try{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log('Error getting database connection:', err);
                return res.status(500).json({error:'Internal Server Error'});
            }else{
                const query = 'SELECT * FROM users WHERE is_subscribed = true';
                connection.query(query,(error,results)=>{
                    if(error){
                        console.log('Error executing the query',error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({results});
                })
            }
        })
    }catch(e){
        console.log('error getting files data',e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



//get all users data
app.get('/users-data',(req,res)=>{
    try{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log('Error getting database connection:', err);
                return res.status(500).json({error:'Internal Server Error'});
            }else{
                const query = 'SELECT * FROM users ORDER BY signup_on DESC';
                connection.query(query,(err,results)=>{
                    if(err){
                        console.log('Error executing the query',error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({results})
                })
            }
        })
    }catch(err){
        console.log('error getting files data',e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//get blog data 
app.get('/blog-data',(req,res)=>{
    try{
        pool.getConnection((err,connection)=>{
            if(err){
                console.log('Error getting database connection:', err);
                return res.status(500).json({error:'Internal Server Error'});
            }else{
                const query = 'SELECT * FROM blog';
                connection.query(query,(err,results)=>{
                    if(err){
                        console.log('Error executing the query',error);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({results})
                })
            }
        })
    }catch(err){
        console.log('error getting files data',e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



//enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','POST,GET,PUT')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


const PORT = process.env.PORT || 1000;

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})










