const express = require('express')
const {last} = require('lodash')
const ytdl = require('ytdl-core')
const app = express()

const {validate, Joi} = require('express-validation')
const ytdl = require('ytdl-core')

app.get(
    '/api/video',
    validate({
        query: Joi.object({
            id: Joi.string().required()
        })
    }),
    (req, res, next) => {
        const {id} = req.query
        ytdl.getInfo(id)
        .then(({videoDetails, formats}) => {
            const {title, thumbnails} = videoDetails

            const thumbnailURL = last(thumbnails).url;
            
            const 
        })
    }
)


const port = 8000
app.listen(
    port,
    () => console.log('Server listening on port ${port}')
)
