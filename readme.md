# soundcloud-archiver

it is rumored that soundcloud may be shuttering soon. it is a useful opertunity to tell people about why data ownership is important, and provide a tool for backing up and sharing their tracks.

this is a super sloppy build b/c it was done in around 10 hours.

## todo

- [ ] validate the url is a souncloud url on submit
- [x] add messaging to interface
- [x] keep db of added dats with timestamps
- [ ] setup a cron job to delete them after 15 minutes reading from db
- [ ] notify completion of the archive

## scripts

make sure you have youtube-dl installed!

- **dev**: `npm run dev` to spin up a local sever and watch for changes
- **build**: `npm run build` to bundle the js and generate an index file
- **start**: for production after having built

## flow

- a paragraph about what is happening, and why
- enter a soundcloud url
- download the tracks and metadata into a dat:// archive
- write meta-data json to the archive
- use choo to generate an index.html page with audio plays for the tracks
- show a link to dat project, downloading beaker, how to rehost on hashbase, and a link to the motherboard

## internet archive

- https://twitter.com/bcrypt

## design

### typography

- **serif**: https://fonts.google.com/specimen/Spectral
- **sans**: https://fonts.google.com/specimen/Rubik


