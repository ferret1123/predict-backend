const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
var path = require('path');
const uuid = require('uuid');

const storage = new Storage({
    projectId: 'plantherbs',
    credentials:{
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    }
});

const bucket = storage.bucket('plantherbs-bucket');

const uuidv1 = uuid.v1();

const { plant } = require('./firestore');
const { error } = require('console');

const prediction = async(req, res) => {
    if(req.file){
        const ext = path.extname(req.file.originalname).toLowerCase();

        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp'){
            return res
            .status(404)
            .json({
                status: 'fail',
                message: 'Only use file (.png, .jpg, .jpeg, or .webp)'
            });
        }
        const newFilename = `${uuidv1}-${req.file.originalname}`;
        const blob = bucket.file(`input/${newFilename}`);
        const streamBlob = blob.createWriteStream();

        streamBlob.on('error', (error) => {
            return res
            .status(400)
            .json({
                status: 'fail',
                message: error
            });
        });

        streamBlob.on('finish', async() => {
            const filename = blob.name.replaceAll('/input/\\', '');

            try{
                const getPredict = await axios.get(process.env.LINK_PREDICT_API, {
                    filename: filename
                });
                const predictPlant = getPredict.data;

                const findPlant = await plant.fineOne({
                    where: {
                        nama: predictPlant.nama
                    }
                });

                if(!findPlant){
                    const herbs = await plant.create(predictPlant);
                    return res.json(herbs);
                }

                res.json(findPlant);
            } catch(error){
                console.log(error);
                return res
                .status(400)
                .json({
                    status: 'fail',
                    message: 'Undetectable '
                });
            }
        });

        streamBlob.end(req.file.buffer);
    } else{
        return res
        .status(400)
        .json({
            status: 'fail',
            message: 'Please fill in all required fields'
        });
    }
}

module.exports = { prediction };