# ![Pantograph](http://i.imgur.com/60P4bO7.png)

Pantograph is Goldbely's image resizing and serving service powered by [jimmynicol][]'s [image-resizer][]. It's configured to work with S3 and Heroku out of the box.


[jimmynicol]: https://github.com/jimmynicol
[image-resizer]: https://github.com/jimmynicol/image-resizer


## Heroku serving

Simply create a new Heroku app, set the environment variables, and deploy.

You may need to add Heroku specific environment variables that are not included in the `.env.example`:

```
BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi
NODE_ENV=production
```

### Caching

The app does not do any image caching at all. Because of this it is recommended to place your production app behind a CDN. We use AWS's CloudFront.


## Local image serving

For using Pantograph with local development.

### Docker

Clone the repo to your machine and then:

```bash
docker-compose up
```

Change any settings in the `docker-compose.yml` file to suite your needs.


## Default Image

The `.env` has a `IMAGE_404` variable that should be set as a path to an image relative to your base URL.

When using S3 the path is relative to the bucket root.

When using Local the path is relative to `LOCAL_FILE_PATH`.

**Always** make sure the `IMAGE_404` is set as the plugin code isn't very fault tolerant to that not existing yet.

---

<a href="https://zenhub.com"><img src="https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png"></a>
