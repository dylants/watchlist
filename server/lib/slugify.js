import slug from 'slug';

export default function slugify(string) {
  return slug(string, {
    lower: true,
  });
}
