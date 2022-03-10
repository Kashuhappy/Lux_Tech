const express = require('express');
const {chain, last} = require('lodash');
const {validate, Joi} = require('express-validation');
const ytdl = require('ytdl-core');
const {spawn} = require('child_process');
const ffmepeyPath = require('ffmpeg-static');

const ytdl = require('ytdl-core')

const app = express()

const getResolutions = formats =>
    chain('formats')
    .filter('height')
    .map('height')
    .uniq()
    .orderBy(null, 'desc')
    .value()

app.get(
    '/api/video',
    validate({
        query: Joi.object({
            id: Joi.string().required()
        }),
    }),
    (req, res, next) => {
        const {id} = req.query;

        ytdl.getInfo(id)
            .then(({videoDetails, formats}) => {
                const {title, thumbnails} = videoDetails
                
                const thumbnailURL = last(thumbnails).url;
                
                const resolutions = getResolutions(formats);
                
                res.json(title, thumbnailURL, resolutions)
            })
            .catch(err => next(err));
        },
);

app.get(
    './download',
    validate({
        query: Joi.object({
            id: Joi.string().required(),
            format: Joi.valid('video', 'audio'),
            resolutions: Joi.when(
                'format',
                {
                    is: Joi.valid('video'),
                    then: Joi.number().required()
                }
            )
            }
        })
    }),
    (req, res, next) => {
        const {id, format} = req.query

        ytdl.getInfo(id)
            .then(({videoDetails, formats}) => {
                const {title} = videoDetails;

                const streams = {}
                if (format === 'video') {
                    const resolution = parseInt(req.query.resolution)

                    const videoFormat = chain(formats)
                        .filter(({height, videoCodec}) => (
                            height === resolution && videoCodec?.startsWith('avcl')
                    ))
                    .orderBy('fps', 'desc')
                    .head()
                    .value();

                streams.video = ytdl(id, {quality: videoFormat.itag});
                streams.audio = ytdl(id, {quality: 'highestaudio'})
                }

                if (format === 'audio') {
                    streams.audio = ytdl(id, {quality: 'highestaudio'})
                }

                const pipes = {
                    out: 1,
                    err: 2,
                    video: 3,
                    audio: 4,
                }

                const ffmpegInputOptions = {
                    video: [
                        '-i', 'pipe.${pipes.video}',
                        '-i', 'pipe.${pipes.video}',
                        '-map', '0:v',
                        '-map', '1:a',
                        '-c:v', 'copy',
                        '-c:a', 'libmp3lane',
                        'crf', '27',
                        '-preset', 'veryfast',
                        'movflats', 'frag_keyframe+empty_moov',
                        '-f', 'mp4'
                    ],
                    audio: [
                        '-i', 'pipe.${pipes.video}',
                        '-c:a', 'libmp3lane',
                        '-vn',
                        '-ar', '44100',
                        '-ac', '2',
                        '-b:a', '192k',
                        '-f', 'mp3'

                    ],
                }

                const ffmpegOptions = [
                    ...ffmpegInputOptions[format],
                    'loglevel', 'error',
                    '-'
                ]

                const ffmpegProcess = span(
                    ffmpegPath, 
                )
            })
        .catch(err => next(err))
    }


)

const port = 8000
app.listen(
    port,
    () => console.log('Server listening on port ${port}')
)
