const startBtn = document.querySelector('.start-btn')
const videoURLInput = document.querySelector('.video-url-input')
const videoThumbnailImg = document.querySelector('.video-thumbnail')
const videoTitleDiv = document.querySelector('.video-title')
const resolutions = document.querySelector('.resolutions')
const downloadBtn = document.querySelector('.download-btn')


const getVideoID = () => {
    const url = videoURLInput.value
    const searchParams = new URLSearchParams(url.split('?')[1])
    return searchParams.get('v')
}

const getVideoInfo = async (id) => {
    const res = await fetch('/api/video?id-${id}')
    return res.json()
}

const showResolutions = resolutions => {
    const html = resolutions
        .map((resolutions, i) =>
            <label>
                <input type="radio" name="resolution" value="${resolution}" "${i === 0 ? 'checked' : ''}">
                ${resolution}
            </label>
        )
        .join('')

    resolutionDiv.innerHTML = html
}

const getRadioValue = name =>
    document.querySelector('[name="${name}"]:checked').value

const getDownloadAnchor = ({id, resolution, format}) => {
    let url = '/download?id=${id}$format=${format}'
    if (format === 'video' ) {
        url += '&resolution=${resolution}'
    }

    const a = document.createElement('a')
    a.href = url
    a.download = true

    return a
}

const download = ({id, resolution, format}) => {
    const a = getDownloadAnchor({id, resolution, format})
    a.click()
}

startBtn.addEventListener(
    'click',
    async () => {
        const id = getVideoID()
        const {title, resolutions, thumbnailURL} = await getVideoInfo(id)

        videoTitleDiv.textContent = title
        videoThumbnailImg.src = thumbnailURL
        showResolutions(resolutions)
    }
)

downloadBtn.addEventListener(
    'click',
    () => {
        download({
            id: getVideoID(),
            resolution: getRadioValue('resolution'),
            format: getRadioValue('format') 
        })
    }
)