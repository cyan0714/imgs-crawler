const http = require('http')
const https = require('https')
const path = require('path')
const { createWriteStream, writeFile } = require('fs')
const { promisify } = require('util')

const writeFilePro = promisify(writeFile)

module.exports = async function (src, dir) {
  await urlToImg(src, dir)
  // if (/\.(jpg|png|gif)$/.test(src)) {
  //   await urlToImg(src, dir)
  // } else {
  // await base64ToImg(src, dir)
  // }
}

const urlToImg = async (url, dir) => {
  const mod = /^https/.test(url) ? https : http
  // const ext = path.extname(url);
  const file = path.join(dir, `${Date.now() * Math.random()}.jpg`)
  const fileName = file.split('\\').slice(-1)

  mod.get(url, res => {
    res.pipe(createWriteStream(file)).on('finish', () => {
      console.log(`the ${fileName} has been added to src/imgs`)
    })
  })
}

const base64ToImg = async (str, dir) => {
  // 'data:image/jpeg;base64,/9j/4AAQS
  const matches = str.match(/^data:(.+?);base64,(.+)$/)

  try {
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
    const file = path.join(dir, `${Date.now() * Math.random()}.${ext}`)
    await writeFilePro(file, matches[2], 'base64')
    console.log('the img of the base64 has been added to src/imgs')
  } catch (e) {
    console.log('illegal base64')
  }
}
