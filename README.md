# Mahuba

A personal blog about health, nutrition and alternative medicine.

## Future Plans

The future plans for Mahuba include:

### User section

- Downloading ebooks made by the author of the blog
- Paid video lectures
- Scheduling in person consultations

### Admin section

- Block editor for creating blog posts
  - Support for different block types
    - Paragraphs ✅
    - Images
    - Quotes
    - Videos
  - The option to drag and drop blocks
  - Adding up to three columns for block alignment
  - Deny entry to unauthorized users

## Scripts

`npm run start` - Runs migrations and then starts the application. Carefull when deploying because if multiple migrations run and the last one fails, the database may be left in an inconsistent state. Beacause the migrations that passed will be applied and the one that failed will not. Changing the data in db to resolve inconsistencies could be done maybe with a custom migration using `drizzle-kit generate --custom --name=seed-users` which will generate an empty migration ready for custom SQL.
