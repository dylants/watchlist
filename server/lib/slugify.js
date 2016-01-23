import slug from 'slug';

export default function slugify(string) {
  const slugy = slug(string, {
    lower: true,
  });

  // to avoid problems with mongo, restrict the length to 60 characters
  // http://docs.mongodb.org/manual/reference/limits/#Length-of-Database-Names
  return slugy.slice(0, 60);
}
