

const url = "https://rvovhwrtalfixyseufsu.supabase.co/rest/v1/news?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM";

async function fetchStats() {
    const res = await fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }});
    const data = await res.json();
    console.log(`Total News: ${data.length}`);
    data.forEach(n => console.log(`- [${n.date}] ${n.title} (Author: ${n.author_id})`));
}

fetchStats();
