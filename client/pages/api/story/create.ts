/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { fetchCMS } from '@lib/cms';
import { fetchMe } from '@lib/me';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

const { serverRuntimeConfig } = getConfig();
async function createStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getToken({ req, secret: serverRuntimeConfig.SECRET });
    const { body } = req;
    body.slug = uuidv4();
    body.publishedAt = null;
    body.author = session.id;
    const data = await fetchCMS('/api/stories?populate[0]=id', 'POST', session.jwt, {
      data: body,
    });
    const me = await fetchMe('/api/users/me?populate[0]=stories', 'GET', session.jwt);
    await fetchCMS(`/api/users/${session.id}`, 'PUT', session.jwt, {
      ...session.user,
      image: session.picture,
      stories: [...me.stories, data.id],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: error.message });
  }
}

export default createStory;
