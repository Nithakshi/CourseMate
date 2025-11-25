// src/utils/api.js
const OPEN_LIBRARY_SEARCH = 'https://openlibrary.org/search.json?q=';

export async function searchCourses(query = 'programming') {
  // We treat search results as "courses" by using Open Library search for the query
  const url = OPEN_LIBRARY_SEARCH + encodeURIComponent(query);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  // map items - keep only fields we need
  const docs = (json.docs || []).map(item => ({
    id: item.key || item.cover_edition_key || item.title,
    title: item.title || 'Untitled',
    author_name: item.author_name ? item.author_name.join(', ') : 'Unknown',
    cover_i: item.cover_i || null,
    year: item.first_publish_year || null,
    subject: item.subject ? item.subject.slice(0,3) : [],
  }));
  return docs;
}
