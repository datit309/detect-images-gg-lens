import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import axios from 'axios';
import path from "path";
import {resolve} from 'path';
import * as moment from "moment";
const FormData = require('form-data');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const fileName = '8.png';
  const filepath = resolve(process.cwd(), `storages/${fileName}`);
  const timeStamp = moment().valueOf();
  const url = `https://lens.google.com/v3/upload?hl=en-VN&re=df&stcs=${timeStamp}&ep=subb`;
  const contentFile = fs.readFileSync(filepath);
  const formData = new FormData();
  formData.append('encoded_image', contentFile, {
    filename: 'download.jpg',
    contentType: 'image/jpeg',
  });

// Post to lens url
  axios.post(url, formData, {
    headers: {
      'Referer': 'https://lens.google.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  })
      .then((response) => {
        const match = response.data.match(/\"\,\[\[\[(.*?)\]\]\,\"/);
        const allText = match ? JSON.parse(`[${match[1]}]`) : [];
        console.log(allText)

      })
      .catch((error) => {
        console.error(error);
      });
}
bootstrap();

