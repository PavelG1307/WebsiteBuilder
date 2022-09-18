// const fs = require("fs");
const uuid = require("uuid");
const { mkdir, cp, readFile, writeFile } = require('node:fs/promises')

const controller = {
  create: async (req, res) => {
    const { type, title, phones, about, text2 } = req.body;
    const { logo, image } = req.files;
    const verify = async (data) => {
      return true;
    };
    if (!verify({ type, title, phones, about, logo, image })) {
      res.json({ success: false });
      return;
    }
    
    const phonesStr = JSON.parse(phones).join(' <br> ')
    const dir = `./static/${uuid.v4()}/`;
    await mkdir(dir)
    const numberTemplates = 1;
    const template = `./templates/${type}/${numberTemplates}`;
    await cp(template, dir, { recursive: true});
    req.files.logo.mv(dir + "assets/logo.png");
    req.files.image.mv(dir + "assets/image.png");

    const pageData = await readFile(dir + 'index.html')
    let page = pageData.toString()
    page = page.replace('$title$', title)
      .replaceAll('$logo$', 'assets/logo.png')
      .replace('$image$', 'assets/image.png')
      .replace('$about$', about)
      .replace('$phone$', phonesStr)
      .replace('$footer$', text2 || '')
    await writeFile(dir + 'index.html', page)
    res.json({ url: 'http://' + req.hostname + ':8080' + dir.slice(1)});
  },
};

// module.exports.parseFiles = async (files) => {
//     const filesPath = []
//     for (const i in files) {
//       const file = files[i]
//       const contextType = file.mimetype
//       if (contextType.split('/')[0] === 'image') {
//         const bigImg = await sharp(file.data).webp().toBuffer()
//         const smalImg = await sharp(file.data).resize(140, 140).webp().toBuffer()
//         const extension = '.webp'
//         const path = `/feedback/${contextType.split('/')[0]}/${randHashId(true)}`
//         const upload = await Storage.uploadFile(
//           path + extension,
//           bigImg,
//           contextType
//         )
//         const uploadSmall = await Storage.uploadFile(
//           path + '-x140' + extension,
//           smalImg,
//           contextType
//         )
//         if (upload && upload.success && uploadSmall && uploadSmall.success) {
//           filesPath.push(`https://471828.selcdn.ru/z1${path}${extension}`)
//         }
//       }
//     }
//     return filesPath
//   }

module.exports = (method) => {
  return async function (request, response, next) {
    try {
      await controller[method](request, response, next);
    } catch (error) {
      return next(error);
    }
  };
};
