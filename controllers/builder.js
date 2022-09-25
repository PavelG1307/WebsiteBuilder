// const fs = require("fs");

const { mkdir, cp, readFile, writeFile } = require('node:fs/promises')
const { getHashId } = require('../utils')

const controller = {
  create: async (req, res) => {
    const { type, title, phones, about, text2, address } = req.body;
    const { logo, image } = req.files;
    const data = { type, title, phones, about, logo, image, address }
    const templates = require('../templates/data.json');
    const verify = async (data) => {
      if (!(type in templates)) {
        return false
      }
      // const keys = Object.keys(data)
      // for (const i in keys) {
      //   if (!data[keys[i]]) {
      //     return false
      //   }
      // }
      return true;
    };
    const getTemplate = (data, i) => {
      const count = Object.keys(templates[type]).length
      if (i>=count) {
        return null
      }
      const number = Math.floor(Math.random() * count)
      const keys = Object.keys(data)
      const fields = templates[type][number].fields
      const optionalFields = templates[type][number].optionalFields
      if (keys.length === fields.length)
      for (const i in keys) {
        if (!(keys[i] in fields)) {
          return getTemplate(data, i ? 1 : i++)
        }
      }
      return { dir: `./templates/${type}/${number}`, fields: fields.push(optionalFields) }
    }
    data['phone'] = JSON.parse(phones).join(' <br> ')
    delete data.phones
    const template = getTemplate(data)
    if (!(await verify(data)) || !template) {
      res.status(400).json({ success: false,  message: 'Недостаточно данных'});
      return;
    }
    const hashId = getHashId()
    const dir = `./static/${hashId}/`;
    await mkdir(dir)
    await cp(template.dir, dir, { recursive: true});
    for (const i in Object.keys(req.files)) {
      const filename = Object.keys(req.files)[i]
      req.files.logo.mv(dir + "assets/logo.png");
    }

    const pageData = await readFile(dir + 'index.html')
    let page = pageData.toString()
    for (const i in template.fields) {
      const field = template.fields[i]
      page = page.replace(`$${field}$`, data[field] || '')
    }
    await writeFile(dir + 'index.html', page)
    res.json({ url: 'http://' + hashId + '.' + req.hostname.split('.')[1] + ':8080/'});
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
