import needle from 'needle';
import * as cheerio from 'cheerio';

interface IUrlParams {
  scheme: string;
  userinfo?: {
    username: string;
    password: string;
  };
  hostname: string;
  port?: number;
  path?: string | string[];
  query?: { [key: string]: string; };
  fragment?: string;
}

const discogsUrl: IUrlParams = {
  scheme: 'https',
  hostname: 'www.discogs.com'
};

function buildUrl(params: IUrlParams) {
  return [
    `${params.scheme}://`,
    params.userinfo ? `${params.userinfo.username}:${params.userinfo.password}@` : '',
    params.hostname,
    params.port || '',
    typeof params.path === 'string' ? `/${params.path}` : `/${params.path.join('/')}`,
    params.query ? `?${Object.entries(params.query).map(([key, value]) => `${key}=${value}`).join('&')}` : '',
    params.fragment || '',
  ].join('');
}

export default class DiscogsScrapper {
  static getAlbums(artist: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const searchUrl = buildUrl({
        ...discogsUrl,
        path: ['search'],
        query: {
          q: artist.replace(' ', '+'),
          type: 'artist',
        }
      });

      needle.get(searchUrl, (err, res) => {
        if (err) {
          return reject(err);
        }

        const $ = cheerio.load(res.body);

        const artistPath = $('.card > h4 > a').attr('href')
          || $('.card > h5 > span > a').attr('href')
          || '';

        if (artistPath) {
          const artistUrl = buildUrl({
            ...discogsUrl,
            path: artistPath,
            query: {
              type: 'Releases',
              subtype: 'Albums',
              filter_anv: '0',
            },
          });

          needle.get(artistUrl, (error, response) => {
            console.log(`fetch ${artist}: [${artistUrl}]`);

            if (error) {
              return reject(error);
            }

            const $artist = cheerio.load(response.body);

            const albums = [];

            $artist('td.image > a > span > img').map((i: number, el: cheerio.TagElement) => {
              albums.push(el.attribs['data-src']);
            });

            console.log(albums);
            resolve(albums.filter(Boolean));
          });
        }
      });
    });
  }
}