/* eslint-disable @typescript-eslint/no-throw-literal */
import { fetchCMS } from '@lib/cms';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils';
import qs from 'qs';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

async function createPage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body } = req;
    console.log('Wtf ??', body);
    const data = await fetchCMS(`/api/pages?story=${body.story_slug}`, 'POST', {
      data: body,
    });
    console.log('data', data);
    res.json(data);
  } catch (error) {
    console.log(error);
    console.log('', error.details);
    res.status(error.status).json({ message: error.message });
  }
}

export default createPage;
